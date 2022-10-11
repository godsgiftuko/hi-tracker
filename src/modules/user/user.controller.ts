import { Controller, Req, Post, Get, Body, Param } from '@nestjs/common';
import { CreateUserDto } from './user.dto';
import { UserService } from './user.service';
import { Request } from 'express';
import {
  E_API_STATUS_CODE,
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
      const data = await this.usersService.create(createUserDto);
      return {
        message: E_API_STATUS_MESSAGE.ok,
        data,
      };
    } catch (error: any) {
      // TODO: Error logging
      return { error };
    }
  }

  @Get(':id')
  show(@Param('id') id: number) {
    return this.usersService.showById(id);
  }

  @Get()
  some(@Req() request: Request) {
    return request;
  }
}
