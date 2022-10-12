import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { User } from './user.entity';
import { CreateUserDto } from './user.dto';
import { E_API_ERR, E_USER_ROLE } from 'src/core/schemas';
import { ADMIN_PHONE, ADMIN_PASSWORD } from 'src/core/constants';

@Injectable()
export class UserService {
  constructor(
    private jwtTokenService: JwtService,
    private configService: ConfigService,
  ) {}

  private get getCreationInfo() {
    if (!ADMIN_PHONE || !ADMIN_PASSWORD) {
      throw new Error(E_API_ERR.missingAdmin);
    }
    return {
      phone: ADMIN_PHONE,
      password: ADMIN_PASSWORD,
      role: E_USER_ROLE.ADMIN,
    };
  }

  async create(createUserDto: CreateUserDto) {
    try {
      const { phone } = createUserDto;
      const users = await this.getAllUsers();
      const userExist = await this.getUserByPhone(phone);

      // Create admin user
      const findAdmin = (user) => user.role === E_USER_ROLE.ADMIN;
      const adminExist = users.find(findAdmin);

      if (!adminExist) {
        await User.create({
          phone: this.getCreationInfo.phone,
          password: this.getCreationInfo.password,
          role: this.getCreationInfo.role,
        }).save();

        console.log('Admin created');
      }

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

  async getAllUsers() {
    try {
      return await User.find();
    } catch (error) {
      throw new NotFoundException();
    }
  }
}
