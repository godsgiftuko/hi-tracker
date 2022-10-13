import {
  BaseEntity,
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  UpdateDateColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { E_USER_ROLE } from '../../core/schemas';
import { FORMAT_AMOUNT } from '../../core/constants';
import { Wallet } from '../wallet/wallet.entity';

@Entity('transactions')
export class Transaction extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  status: string;

  @Column()
  type: string;

  @Column({ nullable: true })
  desc: string;

  @Column({ nullable: true })
  charge: number;

  @Column({ default: 0 })
  amount: number;

  @Column({ nullable: true })
  to: string;

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Wallet, (wallet) => wallet.trx_history, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'wallet_id' })
  wallet: Wallet;
}
