import {
  BaseEntity,
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  PrimaryColumn,
  UpdateDateColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { E_USER_ROLE } from '../../core/schemas';
import { FORMAT_AMOUNT } from '../../core/constants';
import { Wallet } from '../wallet/wallet.entity';

@Entity('transactions')
export class Transaction extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ default: 0 })
  amount: number;

  @Column()
  curr: string;

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Wallet, (wallet) => wallet.trx_history)
  wallet: Wallet;
}
