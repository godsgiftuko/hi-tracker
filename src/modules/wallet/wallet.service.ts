import {
  Injectable,
  ConflictException,
  NotFoundException,
  NotAcceptableException,
  ForbiddenException,
  HttpStatus,
} from '@nestjs/common';
import {
  InjectRepository,
  InjectEntityManager,
  InjectDataSource,
} from '@nestjs/typeorm';
import { Repository, EntityManager, DataSource } from 'typeorm';
import { ALLOWED_CURRENCIES, TRANSFER_LIMIT } from 'src/core/constants';
import { E_API_ERR } from 'src/core/schemas';
import {
  CreateWalletDto,
  DepositFundsDto,
  TransferFundsDto,
} from './wallet.dto';
import { Wallet } from './wallet.entity';
import { UserService } from '../user/user.service';

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(Wallet) private walletRepository: Repository<Wallet>,
    @InjectEntityManager() private walletManager: EntityManager,
    @InjectDataSource() private dataSource: DataSource,
    private readonly userService: UserService,
  ) {}
  async create({ curr, userId }: CreateWalletDto) {
    try {
      const user = await this.userService.getUserById(userId);

      // Verify currency
      if (!ALLOWED_CURRENCIES.includes(curr)) {
        throw new NotAcceptableException(E_API_ERR.invalidCurr);
      }
      const walletExist = await Wallet.findOne({
        where: { curr, user: userId },
      });

      // Check for duplicate
      if (walletExist) {
        throw new ConflictException(E_API_ERR.walletExist);
      }

      // Create wallet
      const wallet = Wallet.create({
        curr,
      });

      wallet.user = user.id;
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
          user: true,
        },
      });
    } catch (error) {
      throw new ForbiddenException();
    }
  }

  async getWalletByUserId(id: number): Promise<Wallet> {
    return await Wallet.findOne({
      where: { user: id },
      relations: {
        trx_history: true,
        user: true,
      },
    });
  }

  async getAllWallets() {
    try {
      const wallets = await Wallet.find({
        relations: {
          trx_history: true,
          user: true,
        },
      });
      return {
        statusCode: HttpStatus.OK,
        size: wallets.length,
        wallets,
      };
    } catch (error) {
      throw error;
    }
  }

  async makeDeposit({ userId, amount, wallet }: DepositFundsDto) {
    try {
      // Check that requested wallet exist
      const walletExist = await Wallet.findOne({
        where: { user: userId, curr: wallet },
      });

      if (!walletExist) {
        throw new NotFoundException(E_API_ERR.walletNotFound);
      }
      if (walletExist.curr !== wallet) {
        throw new NotFoundException(E_API_ERR.walletNotFound);
      }

      // Update wallet
      const credit = amount + walletExist.amount;
      const updateWithDataSource = await this.walletManager.query(`
        UPDATE wallets SET amount = ${credit} WHERE wallet_owner=${userId} AND curr='${wallet}';
      `);

      if (updateWithDataSource) {
        delete walletExist.amount;
        const updatedWallet = { ...walletExist, credit };
        return {
          statusCode: HttpStatus.OK,
          wallet: updatedWallet,
        };
      }
    } catch (error) {
      throw error;
    }
  }

  async makeTransfer({ userId, wallet: curr, to, amount }: TransferFundsDto) {
    const wallets = await Wallet.find({
      relations: {
        user: true,
      },
    });
    console.log({ ...wallets });

    // Check if reciever exist
    const receiverExist = await this.userService.getUserByPhone(to);

    if (!receiverExist) {
      throw new NotFoundException(E_API_ERR.invalidReceiver);
    }

    //* Check that reciever wallet exist
    const findRecieverWallet = (wallet: any) =>
      wallet.curr === curr && wallet.user.id === to;

    if (!wallets.find(findRecieverWallet)) {
      throw new NotFoundException(E_API_ERR.walletNotFound);
    }

    //* Check that sender wallet exist
    const senderWalletExist = await Wallet.findOne({
      where: { user: userId, curr },
    });
    const findSenderWallet = (wallet: any) => wallet.curr === curr;

    if (!wallets.find(findSenderWallet)) {
      throw new NotFoundException(E_API_ERR.walletNotFound);
    }

    if (wallets.find(findSenderWallet).curr !== curr) {
      throw new NotFoundException(E_API_ERR.walletNotFound);
    }

    // make transfer

    // update sender wallet
    const debit = amount;
    // update reciever wallet

    // create transaction record

    // Check for transfer limit
    if (amount >= TRANSFER_LIMIT) {
      // Notify admiin for confirmation
      console.log('please wait while we confirm this transfer');
    }
  }
}
