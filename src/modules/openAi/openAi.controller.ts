import { Body, Controller, Post, Res } from "@nestjs/common";
import { OpenAiService } from "./openAi.service";
import { ChatDto } from "./dto/chat.dto";
import { Response as ExpressResponse } from "express";
import { Response } from "../../shared/response";
import { embeddingTextUtils } from "../../shared/utils/embeddingText";
import OpenAI from "openai";

@Controller('openai')
export class OpenAiController {
    constructor(private readonly openAiService: OpenAiService) { }

    @Post('chat')
    public async chat(@Body() chatDto: ChatDto, @Res() res: ExpressResponse) {
        try {
            const apiKey = res.locals.user.apiKey,
                openai = new OpenAI({
                    apiKey
                });

            if (!chatDto.message) {
                return new Response(false, {}, 'Message is required');
            }

            const embedding = await embeddingTextUtils.embeddingText(chatDto.message, apiKey);

            const semanticSearchContext = await this.openAiService.semanticSearch(embedding.data);
            const context = semanticSearchContext.map((item) => item.text);

            if (context.length === 0) { 
                return new Response(true, { response: 'Não consegui encontrar contexto nos materiais dados sobre a sua pergunta!' });
            }
            const response = await openai.chat.completions.create({
                messages: [{
                    role: 'user', content: `Com base neste contexto ${context.join(" ")} responda: ${chatDto.message} e caso não encontrar no uma resposta exata no 
                contexto, responda: Não consigo responder a essa pergunta` }],
                model: "gpt-4"
            });

            return new Response(true, { response: response.choices[0].message.content })
        } catch (error) {
            return new Response(false, {}, error.message);
        }
    }
}