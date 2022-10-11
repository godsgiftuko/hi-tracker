import {
  Controller,
  Req,
  Post,
  Get,
  Body,
  Param,
  Request,
  HttpStatus,
} from '@nestjs/common';
import { CreateUserDto } from './user.dto';
import { UserService } from './user.service';
import {
  E_CONTENT_TYPE,
  E_API_STATUS_MESSAGE,
  HttpRequest,
  E_API_ERR,
} from 'src/core/schemas';

@Controller('user')
export class UserController {
  constructor(private readonly usersService: UserService) {}

  @Post('new')
  async create(@Body() createUserDto: CreateUserDto) {
    try {
      const user = await this.usersService.create(createUserDto);
      return {
        statusCode: HttpStatus.CREATED,
        user,
      };
    } catch (error) {
      throw error;
    }
  }

  @Get(':id')
  async show(@Param('id') id: number) {
    try {
      const user = await this.usersService.getUserById(id);
      return {
        statusCode: HttpStatus.OK,
        user,
      };
    } catch (error) {
      throw error;
    }
  }

  @Get()
  some(@Req() request: Request) {
    return request;
  }
}
