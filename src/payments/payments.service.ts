import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Payment } from './payment.entity';
import { PurchaseOrder } from '../purchase-orders/purchase-order.entity';
import { CreatePaymentDto } from './dto/create-payment.dto';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,

    @InjectRepository(PurchaseOrder)
    private readonly purchaseOrderRepository: Repository<PurchaseOrder>,
  ) {}

  async createPayment(dto: CreatePaymentDto) {
  // 1️⃣ Find purchase order WITH payments
  const purchaseOrder = await this.purchaseOrderRepository.findOne({
    where: { id: dto.purchaseOrderId },
    relations: ['payments'],
  });

  if (!purchaseOrder) {
    throw new NotFoundException('Purchase Order not found');
  }

  // 2️⃣ Calculate already paid amount
  const totalPaid =
    purchaseOrder.payments?.reduce(
      (sum, p) => sum + Number(p.amount),
      0,
    ) || 0;

  // 3️⃣ Prevent overpayment
  if (totalPaid + dto.amount > Number(purchaseOrder.totalAmount)) {
    throw new BadRequestException('Payment exceeds PO total amount');
  }

  // 4️⃣ Create payment (SAFE DATE)
  const payment = this.paymentRepository.create({
    referenceNumber: `PAY-${Date.now()}`,
    purchaseOrder: purchaseOrder,
    paymentDate: new Date(), // ✅ THIS FIXES YOUR ERROR
    amount: dto.amount,
    method: dto.method,
    notes: dto.notes,
  });

  await this.paymentRepository.save(payment);

  return payment;
}

}
