import { Controller, Get, Post, Body, Delete, Query, UseInterceptors, UploadedFile } from '@nestjs/common';
import { EmbeddingService } from './embedding.service';
import { CreateEmbeddingBodyDto, CreateEmbeddingDto } from './dto/create-embedding.dto';
import { Response } from '../shared/response';
import { CharacterTextSplitter } from "langchain/text_splitter";
import { chunkSize } from '../shared/constants/chunk';
import { openai } from '../shared/openai';
import { FileInterceptor } from '@nestjs/platform-express';
import { PdfDocument } from '@ironsoftware/ironpdf';

@Controller('embedding')
export class EmbeddingController {
  constructor(private readonly embeddingService: EmbeddingService) { }

  @Post('')
  @UseInterceptors(FileInterceptor('file'))
  async createByManual(@UploadedFile() file: Express.Multer.File) {
    try {
      if (!file) {
        return new Response(false, {}, 'File is required');
      }

      const _pdf = await PdfDocument.open(file.buffer);
      const texto = await _pdf.extractText();

      const chunks = await this.splitIntoChunks(texto);

      const embeddings = await Promise.all(chunks.map(async (chunk) => {
        const embedding = await this.embeddingText(chunk);
        await this.embeddingService.create(embedding);

        return embedding;
      }));

      return new Response(true, embeddings);

    } catch (error) {
      return new Response(false, error, `An error occurred: ${error.message}`);
    }
  }

  @Get()
  async findPaginated(@Query('page') page?: number, @Query('limit') limit?: number) {
    const embeddings = await this.embeddingService.findAll({ page, limit });
    return new Response(true, embeddings);
  }

  @Delete('/clearDataBase')
  async remove() {
    const res = await this.embeddingService.clearDatabase();
    return new Response(true, res);
  }

  async splitIntoChunks(text: string) {
    const textSplitter = new CharacterTextSplitter({
      chunkSize,
      chunkOverlap: 200
    }),
      chunks = await textSplitter.splitText(text);

    return chunks;
  }

  async embeddingText(text: string) {
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
