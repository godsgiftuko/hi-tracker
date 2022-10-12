import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module';
import { WalletController } from './wallet.controller';
import { Wallet } from './wallet.entity';
import { WalletService } from './wallet.service';

@Module({
  imports: [UserModule, TypeOrmModule.forFeature([Wallet])],
  controllers: [WalletController],
  providers: [WalletService],
})
export class WalletModule {}
