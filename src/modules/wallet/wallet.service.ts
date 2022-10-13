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
import {
  E_API_ERR,
  E_TRANSACTION_STATUS,
  E_WALLET_OPERATIORS,
} from 'src/core/schemas';
import {
  CreateWalletDto,
  DepositFundsDto,
  TransferFundsDto,
} from './wallet.dto';
import { Wallet } from './wallet.entity';
import { UserService } from '../user/user.service';
import { Transaction } from '../transaction/transaction.entity';
import { TransactionService } from '../transaction/transaction.service';

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(Wallet) private walletRepository: Repository<Wallet>,
    @InjectEntityManager() private walletManager: EntityManager,
    @InjectDataSource() private dataSource: DataSource,
    private readonly userService: UserService,
    private readonly transactionService: TransactionService,
  ) {}

  async create({ curr, userId }: CreateWalletDto) {
    try {
      const user = await this.userService.getUserById(userId);

      // Verify currency
      if (!ALLOWED_CURRENCIES.includes(curr)) {
        throw new NotAcceptableException(E_API_ERR.invalidCurr);
      }

      const [walletExist] = await await this.walletManager.query(`
        SELECT * FROM wallets WHERE curr='${curr}' AND wallet_owner=${userId} 
      `);

      console.log({ walletExist, userId, curr, user });

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

  async makeDeposit({ userId, amount, wallet: curr }: DepositFundsDto) {
    try {
      // Check that requested wallet exist
      const [walletExist] = await await this.walletManager.query(`
        SELECT * FROM wallets WHERE curr='${curr}' AND wallet_owner=${userId} 
      `);

      if (!walletExist) {
        throw new NotFoundException(E_API_ERR.walletNotFound);
      }
      if (walletExist.curr !== curr) {
        throw new NotFoundException(E_API_ERR.walletNotFound);
      }

      // Update wallet
      const credit = amount + walletExist.amount;
      const updateWalletWithDataSource = await this.walletManager.query(`
        UPDATE wallets SET amount = ${credit} WHERE wallet_owner=${userId} AND curr='${curr}';
      `);

      if (updateWalletWithDataSource) {
        // Record successful deposit
        // Notify admiin for confirmation
        return await this.transactionService.generateReceipt({
          status: E_TRANSACTION_STATUS.SUCCESSFUL,
          type: E_WALLET_OPERATIORS.DEPOSIT,
          amount,
          desc: E_WALLET_OPERATIORS.DEPOSIT,
        });
      }

      // Record failed deposit
      const receipt = await Transaction.create({
        status: E_TRANSACTION_STATUS.FAILED,
        type: E_WALLET_OPERATIORS.DEPOSIT,
        amount,
        desc: E_WALLET_OPERATIORS.DEPOSIT,
      });

      receipt.wallet = walletExist.id;
      await receipt.save();
    } catch (error) {
      throw error;
    }
  }

  async makeTransfer({
    userId,
    wallet: curr,
    to: receiverPhone,
    amount,
    desc,
  }: TransferFundsDto) {
    const wallets = await Wallet.find({
      relations: {
        user: true,
      },
    });

    //* Check if reciever exist
    const receiverExist = await this.userService.getUserByPhone(receiverPhone);

    if (!receiverExist) {
      throw new NotFoundException(E_API_ERR.invalidReceiver);
    }

    //* Check that reciever wallet exist
    const findRecieverWallet = (wallet: any) =>
      wallet.curr === curr && wallet.user.phone === receiverPhone;
    const receiverWallet = wallets.find(findRecieverWallet);

    if (!receiverWallet) {
      throw new NotFoundException(E_API_ERR.walletNotFound);
    }

    //* Check that sender wallet exist
    const findSenderWallet = (wallet: any) =>
      wallet.curr === curr && wallet.user.id === userId;
    const senderWallet = wallets.find(findSenderWallet);

    if (!senderWallet) {
      throw new NotFoundException(E_API_ERR.walletNotFound);
    }

    //* make transfer
    // Check that balance is enough for transaction
    if (amount >= senderWallet.amount) {
      throw new NotAcceptableException('Insufficient funds');
    }

    //* Check transfer limit
    if (amount >= TRANSFER_LIMIT) {
      // Check for transfer limit
      return await this.transactionService.generateReceipt({
        status: E_TRANSACTION_STATUS.AWAITING_CONFIRMATION,
        type: E_WALLET_OPERATIORS.TRANSFER,
        amount,
        to: receiverPhone,
        desc,
        curr,
        senderWallet,
      });
    }

    //* update wallets
    const debitBal = senderWallet.amount - amount;
    const creditBal = receiverWallet.amount - amount;

    const [, updateSenderWallet] = await this.walletManager.query(`
        UPDATE wallets SET amount = ${debitBal} WHERE wallet_owner=${userId} AND curr='${curr}';
      `);

    const [, updateReceiverWallet] = await this.walletManager.query(`
        UPDATE wallets SET amount = ${creditBal} WHERE wallet_owner=${receiverExist.id} AND curr='${curr}';
      `);

    //* Record successful transfer
    if (updateSenderWallet && updateReceiverWallet) {
      return await this.transactionService.generateReceipt({
        status: E_TRANSACTION_STATUS.SUCCESSFUL,
        type: E_WALLET_OPERATIORS.TRANSFER,
        amount,
        to: receiverPhone,
        desc,
        curr,
        senderWallet,
      });
    }

    // Record failed transfer
    return await this.transactionService.generateReceipt({
      status: E_TRANSACTION_STATUS.FAILED,
      type: E_WALLET_OPERATIORS.TRANSFER,
      amount,
      to: receiverPhone,
      desc,
      curr,
      senderWallet,
    });
  }
}
