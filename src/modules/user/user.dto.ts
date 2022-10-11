import {
  IsString,
  IsNotEmpty,
  Length,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  // @MaxLength(11)
  @Length(11)
  phone: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  password: string;
}
