import { Module } from '@nestjs/common';
import { EmbeddingService } from './embedding.service';
import { EmbeddingController } from './embedding.controller';

@Module({
  controllers: [EmbeddingController],
  providers: [EmbeddingService],
})
export class EmbeddingModule { }
