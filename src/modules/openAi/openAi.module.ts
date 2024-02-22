import { MiddlewareConsumer, Module, NestModule, RequestMethod } from "@nestjs/common";
import { OpenAiController } from "./openAi.controller";
import { OpenAiService } from "./openAi.service";
import { AuthenticateMiddleware } from "src/middlewares/authenticate.middleware";
import { ApiKeyVerifyMiddleware } from "src/middlewares/apiKeyVerify.middleware";

@Module({
    controllers: [OpenAiController],
    providers: [OpenAiService]
})
export class OpenAiModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
      consumer
        .apply(AuthenticateMiddleware, ApiKeyVerifyMiddleware )
        .forRoutes({ path: 'openai/*', method: RequestMethod.ALL })
    }
  }
  