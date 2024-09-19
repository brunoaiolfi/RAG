import { Body, Controller, Post, UploadedFile, UseInterceptors } from "@nestjs/common";
import { OpenAiService } from "./openAi.service";
import { ChatDto } from "./dto/chat.dto";
import { Response } from "../../shared/response";
import OpenAI from "openai";
import { CreateEmbeddingDto } from "../embedding/dto/create-embedding.dto";
import { FileInterceptor } from "@nestjs/platform-express";

@Controller('openai')
export class OpenAiController {
    constructor(private readonly openAiService: OpenAiService) { }

    private apiKey = process.env.OPENAIKEY;
    private openai = new OpenAI({
        apiKey: this.apiKey
    });

    @Post('chat')
    public async chat(@Body() { message }: ChatDto) {
        try {
            if (!message) {
                return new Response(false, {}, 'Message is required');
            }

            const embedding = await this.embeddingText(message);

            const semanticSearchContext = await this.openAiService.semanticSearch(embedding.data);
            const context = semanticSearchContext.map((item) => item.text).join(" ");

            if (!context.length) {
                return new Response(true, { response: 'Não consegui encontrar contexto nos materiais dados sobre a sua pergunta!', message: message });
            }

            const completitions = await this.openai.chat.completions.create({
                messages: [{
                    role: 'user', content: `Com base neste contexto ${context} responda: ${message} e caso não encontre uma resposta exata no 
                contexto, responda: Não consigo responder a essa pergunta` }],
                model: "gpt-4"
            });

            const response = {
                response: completitions.choices[0].message.content,
                message,
                context
            }

            return new Response(true, response)
        } catch (error) {
            return new Response(false, {}, error.message);
        }
    }

    @Post("getItemsFromImages")
    @UseInterceptors(FileInterceptor('image'))
    public async getItemsFromImages(@UploadedFile() image: Express.Multer.File) {
        try {
            const { choices } = await this.openai.chat.completions.create({
                model: "gpt-4o-mini",
                messages: [{
                    role: "user",
                    content: [
                        {
                            type: "text",
                            text: `A imagem abaixo é uma lista de itens para um orçamento, identifique os itens de uma lista de compras e retorne no seguinte formato:
                                item1, item2, item3

                                exemplo, caso você identifique que na imagem esta escrito 3m de fita adesiva, 2 pacotes de papel sulfite e 1 pacote de canetas,
                                você deve retornar:
                                fita adesiva, papel sulfite, caneta

                                lembrese de não incluir a quantidade do item, apenas o nome do item e suas caracteristicas presentes no texto da imagem. Também não inclua o preço do item.

                                Caso não encontre nenhum item na imagem, retorne uma string vazia, ou seja: ''
                            `
                        }, {
                            type: "image_url",
                            image_url: {
                                url: `data:image/jpeg;base64,${image.buffer.toString("base64")}`
                            }
                        }]
                }]
            })


            return new Response(true, { items: choices[0].message.content })
        } catch (error) {
            return new Response(false, {}, error.message);
        }
    }

    public async embeddingText(text: string) {
        const { data } = await this.openai.embeddings.create({
            input: text,
            model: "text-embedding-ada-002"
        })

        const response: CreateEmbeddingDto = {
            data: data[0].embedding,
            text
        }

        return response
    }
}