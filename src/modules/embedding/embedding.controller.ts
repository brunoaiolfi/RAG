import { Controller, Get, Post, Delete, Query, UseInterceptors, UploadedFile, Res, Body } from '@nestjs/common';
import { EmbeddingService } from './embedding.service';
import { Response } from '../../shared/response';
import { FileInterceptor } from '@nestjs/platform-express';
import { PdfDocument } from '@ironsoftware/ironpdf';
import { Response as ExpressResponse } from 'express';
import { CharacterTextSplitter } from "langchain/text_splitter";
import { chunkSize } from 'src/shared/constants/chunk';
import OpenAI from 'openai';
import { CreateEmbeddingBodyDto, CreateEmbeddingDto } from './dto/create-embedding.dto';
import { PassThrough } from 'stream';

@Controller('embedding')
export class EmbeddingController {

  constructor(private readonly embeddingService: EmbeddingService) { }

  @Post('/byManual')
  @UseInterceptors(FileInterceptor('file'))
  async createByManual(@UploadedFile() file: Express.Multer.File) {
    try {
      if (!file) {
        return new Response(false, {}, 'File is required');
      }

      const _pdf = await PdfDocument.open(file.buffer);
      const pdfContent = await _pdf.extractText();

      const chunks = await this.splitIntoChunks(pdfContent);

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

  @Post('/byText')
  async createByText(@Body() dto: CreateEmbeddingBodyDto) {
    try {
      if (!dto.text) {
        return new Response(false, {}, 'Text is required');
      }

      const chunks = await this.splitIntoChunks(dto.text);

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
    const res = await this.embeddingService.clear();
    return new Response(true, res);
  }

  public async splitIntoChunks(text: string) {
    const textSplitter = new CharacterTextSplitter({
      chunkSize,
      chunkOverlap: 200
    }),
      chunks = await textSplitter.splitText(text);

    return chunks;
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
