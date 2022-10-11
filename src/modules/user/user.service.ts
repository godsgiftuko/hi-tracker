import { Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { CreateUserDto } from './user.dto';

@Injectable()
export class UserService {
  async create(createUserDto: CreateUserDto) {
    const user = User.create({
      id: 72727,
      phone: '09071046909',
      password: '123456',
    });
    // const user = User.create(createUserDto);
    await user.save();

    delete user.password;
    return user;
  }

  async showById(id: number): Promise<User> {
    const user = await this.findById(id);

    delete user.password;
    return user;
  }

  async findById(id: number) {
    return await User.findOne({ where: { id } });
  }

  async findByEmail(phone: string) {
    return await User.findOne({
      where: { phone },
    });
  }
}
