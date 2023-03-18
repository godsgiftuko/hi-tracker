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
  OneToMany,
  JoinColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { E_USER_ROLE } from '../../core/schemas';
import { FORMAT_AMOUNT } from '../../core/constants';
import { Transaction } from '../transaction/transaction.entity';
import { User } from '../user/user.entity';

@Entity('wallets')
export class Wallet extends BaseEntity {
  @PrimaryGeneratedColumn()
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

  @OneToMany(() => Transaction, (transaction) => transaction.wallet)
  @JoinColumn({ name: 'transaction_histtory' })
  trx_history: Transaction[];

  @Column()
  userId: number;

  @ManyToOne(() => User, (user) => user.wallets, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'wallet_owner' })
  user: User;
}
