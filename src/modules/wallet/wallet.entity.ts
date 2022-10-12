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
  PrimaryGeneratedColumn,
} from 'typeorm';
import { E_USER_ROLE } from '../../core/schemas';
import { FORMAT_AMOUNT } from '../../core/constants';
import { Transaction } from '../transaction/transaction.entity';
import { User } from '../user/user.entity';

@Entity('wallets')
export class Wallet extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ default: 0 })
  amount: number;

  @Column({ unique: true })
  curr: string;

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Transaction, (transaction) => transaction.wallet)
  trx_history: Transaction[];

  @ManyToOne(() => User, (user) => user.wallets)
  user: User;
}
