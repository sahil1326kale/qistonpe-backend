import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Vendor } from '../vendors/vendor.entity';
import { POItem } from './po-item.entity';

@Entity()
export class PurchaseOrder {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  poNumber: string;

  @ManyToOne(() => Vendor)
  vendor: Vendor;

  @Column()
  poDate: Date;

  @Column()
  dueDate: Date;

  @Column('decimal')
  totalAmount: number;

  @Column({ default: 'Draft' })
  status: 'Draft' | 'Approved' | 'Partially Paid' | 'Fully Paid';

  @OneToMany(() => POItem, (item) => item.purchaseOrder, { cascade: true })
  items: POItem[];
}
