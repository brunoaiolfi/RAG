import { Module } from '@nestjs/common';
import { EmbeddingModule } from './modules/embedding/embedding.module';
import { DatabaseModule } from './database/database.module';
import { OpenAiModule } from './modules/openAi/openAi.module';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [EmbeddingModule, OpenAiModule, DatabaseModule, UserModule],
  controllers: [],
  providers: [],
})
export class AppModule { }
