import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import {
  InjectRepository,
  InjectEntityManager,
  InjectDataSource,
} from '@nestjs/typeorm';
import { Repository, EntityManager, DataSource } from 'typeorm';
import {
  E_API_ERR,
  E_API_STATUS_MESSAGE,
  E_TRANSACTION_STATUS,
  E_WALLET_OPERATIORS,
} from 'src/core/schemas';
import { Transaction } from './transaction.entity';
import { UserService } from '../user/user.service';
import { Wallet } from '../wallet/wallet.entity';
@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Wallet)
    private walletRepository: Repository<Wallet>,
    @InjectEntityManager()
    private walletManager: EntityManager,
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    @InjectEntityManager() private transactionManager: EntityManager,
    @InjectDataSource() private dataSource: DataSource,
    private readonly userService: UserService,
  ) {}
  async confirmTransaction(id: number): Promise<any> {
    try {
      const { transactions: awaitingTransactions } =
        await this.getAllTransactions(
          'status',
          E_TRANSACTION_STATUS.AWAITING_CONFIRMATION,
        );

      // * Make sure transaction transaction exist
      const findAwaitingTransaction = (transaction) =>
        transaction.id === id &&
        transaction.status === E_TRANSACTION_STATUS.AWAITING_CONFIRMATION;
      const transaction = awaitingTransactions.find(findAwaitingTransaction);

      if (!transaction) {
        throw new NotFoundException(E_API_ERR.transactionNotFound);
      }

      //* Transaction must be of status AWAITING_CONFIRMATION
      const [updateTransactionWithDataSource] =
        await this.transactionManager.query(
          `UPDATE transactions SET status='${E_TRANSACTION_STATUS.SUCCESSFUL}' WHERE id=${id} AND status='${E_TRANSACTION_STATUS.AWAITING_CONFIRMATION}';`,
        );

      if (updateTransactionWithDataSource) {
        const curr = transaction.wallet.curr;
        const receiver = await this.userService.getUserByPhone(transaction.to);
        const receiverWallet = receiver.wallets.find(
          (wallet) => wallet.curr === curr,
        );
        const creditBal = receiverWallet.amount + transaction.amount;

        // * Update receiver's wallet
        const [, updateRecieverWallet] = await this.walletManager.query(`
        UPDATE wallets SET amount = ${creditBal} WHERE wallet_owner=${receiver.id} AND curr='${curr}';
        `);

        //* Record successful confirmation
        const { status, wallet, ...receipt } = transaction;
        return await this.generateReceipt({
          status: E_TRANSACTION_STATUS.SUCCESSFUL,
          ...receipt,
          curr: wallet.curr,
        });
      }
    } catch (error) {
      throw new NotFoundException(E_API_ERR.transactionNotFound);
    }
  }

  protected async findById(id: number) {
    try {
      return await Transaction.findOne({
        where: { id },
        relations: {
          wallet: true,
        },
      });
    } catch (error) {
      throw new NotFoundException(E_API_ERR.transactionNotFound);
    }
  }

  async getAllTransactions(key?: string, value?: string) {
    let transactions;

    if (key && value) {
      transactions = await Transaction.find({
        where: {
          [key]: value,
        },
        relations: {
          wallet: true,
        },
      });
    } else {
      transactions = await Transaction.find({
        relations: {
          wallet: true,
        },
      });
    }

    return {
      size: transactions.length,
      transactions,
    };
  }

  async generateReceipt({
    curr,
    to,
    amount,
    status,
    type,
    desc,
    charge,
    senderWallet,
  }: any) {
    let receipt;

    if (E_WALLET_OPERATIORS.TRANSFER === type) {
      receipt = await Transaction.create({
        status,
        type,
        amount,
        to,
        desc,
        charge,
      });
      receipt.wallet = senderWallet;
      await receipt.save();
    }

    if (E_WALLET_OPERATIORS.DEPOSIT === type) {
      receipt = await Transaction.create({
        status,
        type,
        amount,
      });
      receipt.wallet = senderWallet;
      await receipt.save();
    }

    const { wallet, ...readableReceipt } = receipt;
    return {
      statusCode: HttpStatus.OK,
      receipt: { ...readableReceipt, curr },
    };
  }
}
