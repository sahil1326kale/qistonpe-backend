import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vendor } from '../vendors/vendor.entity';
import { PurchaseOrder } from '../purchase-orders/purchase-order.entity';
import { Payment } from '../payments/payment.entity';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(Vendor)
    private vendorRepo: Repository<Vendor>,

    @InjectRepository(PurchaseOrder)
    private poRepo: Repository<PurchaseOrder>,

    @InjectRepository(Payment)
    private paymentRepo: Repository<Payment>,
  ) {}

  async getVendorOutstanding() {
    const vendors = await this.vendorRepo.find();

    const result: {
  vendorId: number;
  vendorName: string;
  outstandingAmount: number;
}[] = [];


    for (const vendor of vendors) {
      // 1️⃣ Get all POs of this vendor
      const pos = await this.poRepo.find({
        where: { vendor: { id: vendor.id } },
      });

      let totalPOAmount = 0;
      let totalPaid = 0;

      for (const po of pos) {
        totalPOAmount += Number(po.totalAmount);

        // 2️⃣ Get payments for each PO
        const payments = await this.paymentRepo.find({
          where: { purchaseOrder: { id: po.id } },
        });

        payments.forEach((p) => {
          totalPaid += Number(p.amount);
        });
      }

      const outstanding = totalPOAmount - totalPaid;

      result.push({
  vendorId: vendor.id,
  vendorName: vendor.name,
  outstandingAmount: outstanding,
});

    }

    return result;
  }
}
