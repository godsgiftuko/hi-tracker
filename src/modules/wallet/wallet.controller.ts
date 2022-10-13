import {
  Controller,
  Post,
  Body,
  HttpStatus,
  Get,
  Req,
  Put,
  UseGuards,
  NotAcceptableException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { CreateWalletDto, DepositFundsDto } from './wallet.dto';
import { WalletService } from './wallet.service';
import { AllowedRoles, LoggedInUser } from '../auth/auth.decorator';
import { E_USER_ROLE, E_WALLET_OPERATIORS } from 'src/core/schemas';

@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @AllowedRoles(E_USER_ROLE.CUSTOMER)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Post('new')
  async create(@Body() createWalletDto: CreateWalletDto, @Req() req) {
    try {
      const { id: userId } = req.user;
      const walletCto = { ...createWalletDto, userId };
      const wallet = await this.walletService.create(walletCto);

      return {
        statusCode: HttpStatus.CREATED,
        ...wallet,
      };
    } catch (error) {
      throw error;
    }
  }

  @AllowedRoles(E_USER_ROLE.CUSTOMER)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Put()
  async makeDeposit(@Body() depositFundsDto: any, @Req() req) {
    try {
      const { id: userId } = req.user;
      const walletCto = { ...depositFundsDto, userId };

      switch (depositFundsDto.operator) {
        case E_WALLET_OPERATIORS.DEPOSIT:
          return await this.walletService.makeDeposit(walletCto);
          break;
        case E_WALLET_OPERATIORS.TRANSFER:
          return await this.walletService.makeTransfer(walletCto);
          break;
        default:
          throw new NotAcceptableException('Unaccepted transaction');
          break;
      }
    } catch (error) {
      throw error;
    }
  }
}
