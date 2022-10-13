import {
  Controller,
  Put,
  Param,
  UseGuards,
  Get,
  HttpStatus,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { E_USER_ROLE } from 'src/core/schemas';
import { AllowedRoles } from '../auth/auth.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { TransactionService } from './transaction.service';

@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}
  @AllowedRoles(E_USER_ROLE.ADMIN)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Put('confirm/:id')
  async confirmUserTransfer(@Param('id') id: number) {
    try {
      const report = await this.transactionService.confirmTransaction(id);
      return {
        statusCode: HttpStatus.OK,
        report,
      };
    } catch (error) {
      throw error;
    }
  }

  @AllowedRoles(E_USER_ROLE.ADMIN)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Get('awaiting')
  async getAwaitingTransactions() {
    try {
    } catch (error) {
      throw error;
    }
  }

  @AllowedRoles(E_USER_ROLE.ADMIN)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Get('all')
  async getTransactions() {
    try {
      const transactions = await this.transactionService.getAllTransactions();
      return {
        statusCode: HttpStatus.OK,
        ...transactions,
      };
    } catch (error) {
      throw error;
    }
  }
}
