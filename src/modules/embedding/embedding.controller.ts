import { Controller, Get, Post, Delete, Query, UseInterceptors, UploadedFile } from '@nestjs/common';
import { EmbeddingService } from './embedding.service';
import { Response } from '../../shared/response';
import { FileInterceptor } from '@nestjs/platform-express';
import { PdfDocument } from '@ironsoftware/ironpdf';
import { embeddingTextUtils } from '../../shared/utils/embeddingText';

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
      const pdfContent = await _pdf.extractText();

      const chunks = await embeddingTextUtils.splitIntoChunks(pdfContent);

      const embeddings = await Promise.all(chunks.map(async (chunk) => {
        const embedding = await embeddingTextUtils.embeddingText(chunk);
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

}
