import { Body, Controller, Post, Res } from "@nestjs/common";
import { OpenAiService } from "./openAi.service";
import { ChatDto } from "./dto/chat.dto";
import { Response as ExpressResponse } from "express";
import { Response } from "../../shared/response";
import OpenAI from "openai";
import { CreateEmbeddingDto } from "../embedding/dto/create-embedding.dto";

@Controller('openai')
export class OpenAiController {
    constructor(private readonly openAiService: OpenAiService) { }

    @Post('chat')
    public async chat(@Body() { message }: ChatDto) {
        try {
            const apiKey = process.env.OPENAIKEY,
                openai = new OpenAI({
                    apiKey
                });

            if (!message) {
                return new Response(false, {}, 'Message is required');
            }

            const embedding = await this.embeddingText(message);

            const semanticSearchContext = await this.openAiService.semanticSearch(embedding.data);
            const context = semanticSearchContext.map((item) => item.text).join(" ");

            if (!context.length) {
                return new Response(true, { response: 'Não consegui encontrar contexto nos materiais dados sobre a sua pergunta!', message: message });
            }

            const completitions = await openai.chat.completions.create({
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

    public async embeddingText(text: string) {
        const apiKey = process.env.OPENAIKEY;

        const openai = new OpenAI({
            apiKey
        });

        const { data } = await openai.embeddings.create({
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