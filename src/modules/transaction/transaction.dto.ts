import {
  IsString,
  IsNotEmpty,
  Length,
  MinLength,
  Matches,
  IsOptional,
  IsNumber,
} from 'class-validator';
import { E_TRANSACTION_STATUS, E_WALLET_OPERATIORS } from '../../core/schemas';
import { ALLOWED_CURRENCIES } from '../../core/constants';
import { Wallet } from '../wallet/wallet.entity';

export class CreateTransactionDto {
  @IsNotEmpty()
  @IsString()
  @Matches(
    `^${Object.values(E_TRANSACTION_STATUS)
      .filter((v) => typeof v !== 'number')
      .join('|')}$`,
    'i',
  )
  status: E_TRANSACTION_STATUS;

  @Matches(
    `^${Object.values(E_WALLET_OPERATIORS)
      .filter((v) => typeof v !== 'number')
      .join('|')}$`,
    'i',
  )
  type: E_WALLET_OPERATIORS;

  @IsOptional()
  @IsString()
  desc?: string;

  @IsNotEmpty()
  @IsNumber()
  charge?: number;

  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @IsOptional()
  @IsNumber()
  to?: string;

  @IsNotEmpty()
  @IsString()
  curr?: string;

  @IsOptional()
  @IsNotEmpty()
  senderWallet?: Wallet;
}
