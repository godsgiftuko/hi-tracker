import {
  IsString,
  IsNotEmpty,
  Length,
  MinLength,
  Matches,
  IsOptional,
  IsNumberString,
  IsPhoneNumber,
} from 'class-validator';
import { E_USER_ROLE } from '../../core/schemas';

export class CreateUserDto {
  @IsNotEmpty()
  @IsPhoneNumber('NG')
  @IsNumberString()
  @Length(11, 11)
  phone: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  password: string;

  @IsOptional()
  @Matches(
    `^${Object.values(E_USER_ROLE)
      .filter((v) => typeof v !== 'number')
      .join('|')}$`,
    'i',
  )
  role: E_USER_ROLE;
}

export class LoginUserDto {
  @IsNotEmpty()
  @IsString()
  phone: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
