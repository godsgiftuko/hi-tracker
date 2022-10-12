import {
  IsString,
  IsNotEmpty,
  Length,
  MinLength,
  Matches,
  IsOptional,
  IsNumber,
} from 'class-validator';
import { E_WALLET_OPERATIORS } from '../../core/schemas';
import { ALLOWED_CURRENCIES } from '../../core/constants';

export class CreateTransactionDto {
  @IsNotEmpty()
  @IsString()
  desc: string;

  @IsNotEmpty()
  @IsString()
  status: string;

  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @IsNotEmpty()
  @IsNumber()
  charge: number;

  @Matches(
    `^${Object.values(E_WALLET_OPERATIORS)
      .filter((v) => typeof v !== 'number')
      .join('|')}$`,
    'i',
  )
  type: typeof E_WALLET_OPERATIORS;
}
