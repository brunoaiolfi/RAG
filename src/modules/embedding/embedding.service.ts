import { Injectable } from '@nestjs/common';
import { CreateEmbeddingDto } from './dto/create-embedding.dto';
import { PrismaService } from 'src/database/prisma.service';
import { Pagination } from 'src/@types/api/get';
import { defaultLimit, defaultPage } from '../../shared/constants/api/pagination'
@Injectable()
export class EmbeddingService {

  public constructor(private readonly prismaService: PrismaService) { }

  async create(createEmbeddingDto: CreateEmbeddingDto) {
    const res = await this.prismaService.embedding.create({
      data: {
        ...createEmbeddingDto
      }
    })

    return res;
  }

  async findAll({ limit: take = defaultLimit, page = defaultPage, where }: Pagination) {
    const skip = page && take ? (page - 1) * take : 0,
      res = await this.prismaService.embedding.findMany({
        where,
        skip,
        take
      });

    return res;
  }

  async clear() {
    const res = await this.prismaService.embedding.deleteMany({});
    return res;
  }
}
