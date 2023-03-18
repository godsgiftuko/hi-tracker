import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './modules/user/user.module';
import { User } from './modules/user/user.entity';
import { AuthModule } from './modules/auth/auth.module';
import { WalletModule } from './modules/wallet/wallet.module';
import { Wallet } from './modules/wallet/wallet.entity';
import { TransactionModule } from './modules/transaction/transaction.module';
import { Transaction } from './modules/transaction/transaction.entity';
import { HealthController } from './modules/health/health.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: +configService.get<number>('DB_PORT'),
        username: configService.get('DB_USER'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        entities: [User, Wallet, Transaction],
        synchronize: true, //! This will purge the database automatically on server restart if set to => true. Set to => false on production env.
      }),
      inject: [ConfigService],
    }),
    UserModule,
    AuthModule,
    WalletModule,
    TransactionModule,
  ],
  controllers: [HealthController],
  providers: [],
})
export class AppModule {}
