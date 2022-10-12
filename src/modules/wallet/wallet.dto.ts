import {
  IsString,
  IsNotEmpty,
  Length,
  MinLength,
  Matches,
  IsOptional,
  ValidateNested,
  IsPhoneNumber,
  IsNumberString,
  IsNumber,
} from 'class-validator';
import { E_USER_ROLE, E_WALLET_OPERATIORS } from '../../core/schemas';
import { ALLOWED_CURRENCIES } from '../../core/constants';

interface Deposit {
  amount: number;
  wallet: string;
}

export class CreateWalletDto {
  @IsOptional()
  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @IsNotEmpty()
  @IsString()
  curr: string;
}

export class DepositFundsDto {
  @Matches(E_WALLET_OPERATIORS.DEPOSIT)
  operator: string;

  @IsOptional()
  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @IsNotEmpty()
  @IsString()
  wallet: string;
}

export class TransferFundsDto {
  @Matches(E_WALLET_OPERATIORS.TRANSFER)
  operator: string;

  @IsOptional()
  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @IsNotEmpty()
  @IsPhoneNumber()
  @IsNumberString()
  to: string;

  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @IsNotEmpty()
  @IsString()
  wallet: string;
}
