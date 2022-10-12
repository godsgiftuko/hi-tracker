import {
  Injectable,
  ConflictException,
  NotFoundException,
  NotAcceptableException,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ALLOWED_CURRENCIES } from 'src/core/constants';
import { E_API_ERR } from 'src/core/schemas';
import { CreateWalletDto } from './wallet.dto';
import { E_USER_ROLE } from 'src/core/schemas';
import { Wallet } from './wallet.entity';
import { AllowedRoles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';

@Injectable()
export class WalletService {
  async create(createWalletDto: CreateWalletDto) {
    try {
      const { curr } = createWalletDto;

      // Verify currency
      if (!ALLOWED_CURRENCIES.includes(curr)) {
        throw new NotAcceptableException(E_API_ERR.invalidCurr);
      }
      const walletExist = await Wallet.findOne({
        where: { curr },
      });

      // Check for duplicate
      if (walletExist) {
        throw new ConflictException(E_API_ERR.walletExist);
      }

      // Create wallet
      const wallet = Wallet.create({
        curr: 'NGN',
      });

      await wallet.save();

      return {
        wallet,
      };
    } catch (error) {
      throw error;
    }
  }

  async getWalletByCurr(curr: string): Promise<Wallet> {
    try {
      return await Wallet.findOne({
        where: { curr },
        relations: {
          trx_history: true,
        },
      });
    } catch (error) {
      throw new NotFoundException();
    }
  }

  @AllowedRoles(E_USER_ROLE.ADMIN)
  // @UseGuards(AuthGuard)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  async getAllWallets() {
    try {
      const wallets = await Wallet.find({
        relations: {
          trx_history: true,
        },
      });
      return {
        statusCode: HttpStatus.OK,
        wallets,
      };
    } catch (error) {
      console.log({ error });
    }
  }
}
