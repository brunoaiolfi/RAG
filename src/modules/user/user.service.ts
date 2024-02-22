import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/database/prisma.service';
import { Pagination } from 'src/@types/api/get';
import { defaultLimit, defaultPage } from 'src/shared/constants/api/pagination';
import { AuthenticateUserDto } from './dto/authenticate-user.dto';

@Injectable()
export class UserService {
  public constructor(private readonly prismaService: PrismaService) { }

  async create({ email, name, password }: CreateUserDto) {
    const response = await this.prismaService.user.create({
      data: {
        email,
        name,
        password
      }
    })

    return response
  }

  async findAll({ limit: take = defaultLimit, page = defaultPage, where }: Pagination) {
    const skip = page && take ? (page - 1) * take : 0,
      res = await this.prismaService.user.findMany({
        where,
        skip,
        take
      });

    return res;
  }

  async getBy(where: any) {
    const user = await this.prismaService.user.findFirst({ where });
    return user;
  }
}
