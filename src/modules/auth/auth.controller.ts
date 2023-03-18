import { Controller, Post, HttpStatus, Body, Get } from '@nestjs/common';
import { LoginUserDto } from '../user/user.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('/health')
  async getHealth(): Promise<string> {
    return this.authService.getHealth();
  }

  async login(@Body() user: LoginUserDto) {
    try {
      const payload = {
        phone: user.phone,
        password: user.password,
      };
      const access_token = await this.authService.generateJWT(payload);
      return {
        statusCode: HttpStatus.OK,
        data: { access_token },
      };
    } catch (error) {
      throw error;
    }
  }
}
