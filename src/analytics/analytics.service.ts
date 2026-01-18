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
  async getPaymentAging() {
  const purchaseOrders = await this.poRepo.find();

  const today = new Date();

  const agingReport = {
    '0-30_days': {
      daysRange: '0 to 30 days overdue',
      amount: 0,
    },
    '31-60_days': {
      daysRange: '31 to 60 days overdue',
      amount: 0,
    },
    '61-90_days': {
      daysRange: '61 to 90 days overdue',
      amount: 0,
    },
    '90+_days': {
      daysRange: 'More than 90 days overdue',
      amount: 0,
    },
  };

  for (const po of purchaseOrders) {
    // Skip fully paid POs
    if (po.status === 'Fully Paid') continue;

    const dueDate = new Date(po.dueDate);
    const diffTime = today.getTime() - dueDate.getTime();
    const overdueDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    // Not overdue yet
    if (overdueDays <= 0) continue;

    const outstandingAmount = Number(po.totalAmount);

    if (overdueDays <= 30) {
      agingReport['0-30_days'].amount += outstandingAmount;
    } else if (overdueDays <= 60) {
      agingReport['31-60_days'].amount += outstandingAmount;
    } else if (overdueDays <= 90) {
      agingReport['61-90_days'].amount += outstandingAmount;
    } else {
      agingReport['90+_days'].amount += outstandingAmount;
    }
  }

  return agingReport;
}

}

