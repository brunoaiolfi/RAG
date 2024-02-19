import { Module } from '@nestjs/common';
import { EmbeddingModule } from './modules/embedding/embedding.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [EmbeddingModule, DatabaseModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
