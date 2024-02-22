import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Response } from 'src/shared/response';
import { generateHash } from 'src/shared/utils/hash';
import { AuthenticateUserDto } from './dto/authenticate-user.dto';
import { generateToken } from 'src/shared/utils/token/generateToken';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    try {
      const { email, name, password } = createUserDto;

      if (!email || !name || !password) {
        return new Response(false, {}, "Email, name and password are required")
      }

      const hashedPassword = generateHash(password);

      const response = await this.userService.create({
        email,
        name,
        password: hashedPassword
      });

      return new Response(true, { password: null, ...response })

    } catch (error) {
      return new Response(false, {}, error.message)
    }
  }

  @Get()
  async findPaginated(@Query('page') page?: number, @Query('limit') limit?: number) {
    const users = await this.userService.findAll({ page, limit });
    return new Response(true, users);
  }

  @Post('authenticate')
  async authenticate(@Body() authenticateDto: AuthenticateUserDto) {
    try {
      const { email, password } = authenticateDto;

      if (!email || !password) {
        return new Response(false, {}, "Email and password are required")
      }

      const hashedPassword = generateHash(password);

      const authenticatedUser = await this.userService.getBy({
        AND: [
          { email },
          { password: hashedPassword }
        ]
      });

      if (!authenticatedUser?.id) {
        return new Response(false, {}, "Invalid credentials")
      }

      const token = generateToken(authenticatedUser),
        response = {
          ...authenticatedUser,
          password: null,
          token
        };

      return new Response(true, response)
    } catch (error) {
      return new Response(false, {}, error.message)
    }
  }
}
