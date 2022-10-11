import { Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { CreateUserDto } from './user.dto';
import { E_API_ERR } from 'src/core/schemas';

@Injectable()
export class UserService {
  async create(createUserDto: CreateUserDto) {
    try {
      console.log({ createUserDto });
      const { phone } = createUserDto;
      const userExist = await this.findByPhone(phone);

      if (userExist) {
        throw {
          status: E_API_ERR.ERR_CODE_DUPLICATE,
          message: E_API_ERR.phoneExist,
        };
      }
      const user = User.create({
        phone: createUserDto.phone,
        password: createUserDto.password,
      });
      // const user = User.create(createUserDto);
      await user.save();

      delete user.password;
      return user;
    } catch (error) {
      console.log({ error });

      throw error;
    }
  }

  async showById(id: number): Promise<User> {
    const user = await this.findById(+id);

    delete user.password;
    return user;
  }

  async findById(id: number) {
    return await User.findOne({ where: { id } });
  }

  async findByPhone(phone: string) {
    return await User.findOne({
      where: { phone },
    });
  }
}
