import {
  IsString,
  IsNotEmpty,
  Length,
  MinLength,
  Matches,
  IsOptional,
  IsNumber,
} from 'class-validator';
import { E_USER_ROLE } from '../../core/schemas';
import { ALLOWED_CURRENCIES } from '../../core/constants';

export class CreateWalletDto {
  // @IsString()
  // @Matches(
  //   `^${Object.values(ALLOWED_CURRENCIES)
  //     .filter((v) => typeof v !== 'number')
  //     .join('|')}$`,
  //   'i',
  // )
  // curr: ALLOWED_CURRENCIES;

  @IsNotEmpty()
  @IsString()
  curr: string;
}

export class WalletDepositDto {
  @IsNotEmpty()
  @IsNumber()
  user: number;

  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @IsNotEmpty()
  @IsString()
  curr: string;

  // @Matches(
  //   `^${Object.values(ALLOWED_CURRENCIES)
  //     .filter((v) => typeof v !== 'number')
  //     .join('|')}$`,
  //   'i',
  // )
  // curr: typeof ALLOWED_CURRENCIES;
}
