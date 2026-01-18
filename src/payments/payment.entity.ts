import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
} from 'typeorm';
import { PurchaseOrder } from '../purchase-orders/purchase-order.entity';

@Entity()
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  referenceNumber: string;

  @ManyToOne(() => PurchaseOrder, (po) => po.payments)
purchaseOrder: PurchaseOrder;


  @Column({ type: 'timestamp' })
paymentDate: Date;


  @Column('decimal')
  amount: number;

  @Column()
  method: 'Cash' | 'Cheque' | 'NEFT' | 'RTGS' | 'UPI';

  @Column({ nullable: true })
  notes: string;
}
