import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { E_API_ERR } from 'src/core/schemas';
import { UserService } from 'src/modules/user/user.service';
import { CreateUserDto, LoginUserDto } from '../user/user.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtTokenService: JwtService,
  ) {}

  async validateUserCredentials(phone: string, password: string): Promise<any> {
    try {
      const user = await this.userService.getUserByPhone(phone);
      const passwordValid = await bcrypt.compare(password, user.password);

      if (!user || !passwordValid) {
        throw new UnauthorizedException(E_API_ERR.wrongLogin);
      }

      return user;
    } catch (error) {
      throw error;
    }
  }

  async loginWithCredentials({ phone, password }: LoginUserDto) {
    try {
      const isValidUser: CreateUserDto = await this.validateUserCredentials(
        phone,
        password,
      );

      const payload = { phone: isValidUser.phone, role: isValidUser.role };

      return this.jwtTokenService.sign(payload);
    } catch (error) {
      throw error;
    }
  }
}
