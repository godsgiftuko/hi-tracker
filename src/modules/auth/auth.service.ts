import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { E_API_ERR, JwtPayload } from 'src/core/schemas';
import { UserService } from 'src/modules/user/user.service';
import { LoginUserDto } from '../user/user.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtTokenService: JwtService,
    private configService: ConfigService,
  ) {}

  getHealth(): string {
    return 'Health is okay';
  }

  async validateUserCredentials(phone: string, password: string): Promise<any> {
    try {
      const user = await this.userService.getUserByPhone(phone);

      if (!user) {
        throw new UnauthorizedException(E_API_ERR.wrongLogin);
      }
      const passwordValid = await bcrypt.compare(password, user.password);

      if (!passwordValid) {
        throw new UnauthorizedException(E_API_ERR.wrongLogin);
      }

      return user;
    } catch (error) {
      throw error;
    }
  }

  async generateJWT({ phone, password }: LoginUserDto) {
    try {
      const isValidUser = await this.validateUserCredentials(phone, password);

      const payload = {
        expiresIn: this.configService.get('JWT_EXPIRES_IN'),
        phone: isValidUser.phone,
        sub: isValidUser.id,
      };

      return this.jwtTokenService.sign(payload);
    } catch (error) {
      throw error;
    }
  }

  async verifyJWT(token: string) {
    try {
      const decoded: JwtPayload = await this.jwtTokenService.verifyAsync(
        token,
        this.configService.get('JWT_SECRET'),
      );

      const { phone, sub } = decoded;
      const user = await this.userService.getUserByPhone(phone);

      if (!user) {
        throw new UnauthorizedException(E_API_ERR.wrongLogin);
      }
      return user;
    } catch (error) {
      throw error;
    }
  }
}
