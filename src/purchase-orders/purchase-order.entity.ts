import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Vendor } from '../vendors/vendor.entity';
import { POItem } from './po-item.entity';
import { Payment } from '../payments/payment.entity';

@Entity()
export class PurchaseOrder {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  poNumber: string;

  @ManyToOne(() => Vendor)
  vendor: Vendor;

  @Column({ type: 'date' })
poDate: Date;

@Column({ type: 'date' })
dueDate: Date;


  @Column('decimal')
  totalAmount: number;

  @Column({ default: 'Draft' })
  status: 'Draft' | 'Approved' | 'Partially Paid' | 'Fully Paid';

  @OneToMany(() => POItem, (item) => item.purchaseOrder, { cascade: true })
  items: POItem[];

  @OneToMany(() => Payment, (payment) => payment.purchaseOrder)
payments: Payment[];

}
