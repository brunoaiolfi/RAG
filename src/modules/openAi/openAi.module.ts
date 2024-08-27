import { Module } from "@nestjs/common";
import { OpenAiController } from "./openAi.controller";
import { OpenAiService } from "./openAi.service";

@Module({
    controllers: [OpenAiController],
    providers: [OpenAiService]
})
export class OpenAiModule { };
