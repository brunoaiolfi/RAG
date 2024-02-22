import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { EmbeddingService } from './embedding.service';
import { EmbeddingController } from './embedding.controller';
import { AuthenticateMiddleware } from 'src/middlewares/authenticate.middleware';

@Module({
  controllers: [EmbeddingController],
  providers: [EmbeddingService],
})
export class EmbeddingModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthenticateMiddleware)
      .forRoutes({ path: 'embedding/*', method: RequestMethod.ALL })
  }
}
