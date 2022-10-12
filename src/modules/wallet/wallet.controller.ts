import { Controller, Post, Body, HttpStatus, Get } from '@nestjs/common';
import { CreateWalletDto } from './wallet.dto';
import { WalletService } from './wallet.service';

@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Post('new')
  async create(@Body() createWalletDto: CreateWalletDto) {
    try {
      const data = await this.walletService.create(createWalletDto);
      return {
        statusCode: HttpStatus.CREATED,
        ...data,
      };
    } catch (error) {
      throw error;
    }
  }

  @Get('all')
  async getWallets() {
    try {
      return await this.walletService.getAllWallets();
    } catch (error) {
      throw error;
    }
  }
}
