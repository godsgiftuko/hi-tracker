import {
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
  HttpStatus,
  Body,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { E_API_STATUS_MESSAGE, E_API_ERR } from 'src/core/schemas';
import { LoginUserDto } from '../user/user.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // @UseGuards(AuthGuard('jwt'))
  @Post()
  async login(@Body() user: LoginUserDto) {
    try {
      const access_token = await this.authService.loginWithCredentials(user);
      return {
        statusCode: HttpStatus.OK,
        data: { access_token },
      };
    } catch (error) {
      throw error;
    }
  }
}
