import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { User } from './user.entity';
import { CreateUserDto } from './user.dto';
import { E_API_ERR } from 'src/core/schemas';

@Injectable()
export class UserService {
  constructor(
    private jwtTokenService: JwtService,
    private configService: ConfigService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const { phone } = createUserDto;
      const userExist = await this.getUserByPhone(phone);

      if (userExist) {
        throw new ConflictException(E_API_ERR.phoneExist);
      }
      const user = User.create({
        phone: createUserDto.phone,
        password: createUserDto.password,
      });

      await user.save();

      delete user.password;

      const payload = {
        expiresIn: this.configService.get('JWT_EXPIRES_IN'),
        phone: user.phone,
        sub: user.id,
      };
      const access_token = this.jwtTokenService.sign(payload);

      return {
        user,
        access_token,
      };
    } catch (error) {
      throw error;
    }
  }

  async getUserById(id: number): Promise<User> {
    try {
      const user = await this.findById(+id);

      delete user.password;
      return user;
    } catch (error) {
      throw new NotFoundException();
    }
  }

  protected async findById(id: number) {
    try {
      return await User.findOne({ where: { id } });
    } catch (error) {
      throw new NotFoundException();
    }
  }

  async getUserByPhone(phone: string) {
    try {
      return await User.findOne({
        where: { phone },
      });
    } catch (error) {
      throw new NotFoundException();
    }
  }
}
