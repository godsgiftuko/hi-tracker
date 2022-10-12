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
      const users = await this.getAllUsers();

      // Create Admin
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

      // Create Customer
      const { phone } = createUserDto;
      const findCustomer = (user) => user.phone === phone;
      const userExist = users.find(findCustomer);

      if (userExist) {
        throw new ConflictException(E_API_ERR.phoneExist);
      }

      const user = User.create({
        phone: createUserDto.phone,
        password: createUserDto.password,
      });

      await user.save();
      delete user.password;

      // Generate JWT
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
      throw new NotFoundException(E_API_ERR.userNotFound);
    }
  }

  protected async findById(id: number) {
    try {
      return await User.findOne({ where: { id } });
    } catch (error) {
      throw new NotFoundException(E_API_ERR.userNotFound);
    }
  }

  async getUserByPhone(phone: string) {
    try {
      return await User.findOne({
        where: { phone },
      });
    } catch (error) {
      throw new NotFoundException(E_API_ERR.userNotFound);
    }
  }

  async getAllUsers() {
    return await User.find({
      relations: {
        wallets: true,
      },
    });
  }
}
