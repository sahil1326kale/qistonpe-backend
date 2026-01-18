import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from './payment.entity';
import { PurchaseOrder } from '../purchase-orders/purchase-order.entity';
import { CreatePaymentDto } from './dto/create-payment.dto';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private paymentRepo: Repository<Payment>,

    @InjectRepository(PurchaseOrder)
    private poRepo: Repository<PurchaseOrder>,
  ) {}

  async createPayment(dto: CreatePaymentDto) {

    const po = await this.poRepo.findOne({
      where: { id: dto.purchaseOrderId },
      relations: ['items'],
    });

    if (!po) {
      throw new NotFoundException('Purchase Order not found');
    }


    const payments = await this.paymentRepo.find({
      where: { purchaseOrder: { id: po.id } },
    });

    const totalPaid = payments.reduce(
      (sum, p) => sum + Number(p.amount),
      0,
    );

    const outstanding = po.totalAmount - totalPaid;


    if (dto.amount > outstanding) {
      throw new BadRequestException(
        'Payment amount exceeds outstanding amount',
      );
    }


    const today = new Date();
    const datePart = today.toISOString().slice(0, 10).replace(/-/g, '');
    const count = await this.paymentRepo.count();
    const referenceNumber = `PAY-${datePart}-${count + 1}`;


    const payment = this.paymentRepo.create({
      referenceNumber,
      purchaseOrder: po,
      paymentDate: new Date(dto.paymentDate),
      amount: dto.amount,
      method: dto.method,
      notes: dto.notes,
    });

    await this.paymentRepo.save(payment);

    const newTotalPaid = totalPaid + dto.amount;

    if (newTotalPaid === po.totalAmount) {
      po.status = 'Fully Paid';
    } else {
      po.status = 'Partially Paid';
    }

    await this.poRepo.save(po);

    return payment;
  }

  findAll() {
    return this.paymentRepo.find({
      relations: ['purchaseOrder'],
    });
  }
}
