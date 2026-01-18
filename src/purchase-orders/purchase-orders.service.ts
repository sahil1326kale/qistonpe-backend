import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PurchaseOrder } from './purchase-order.entity';
import { Vendor } from '../vendors/vendor.entity';
import { CreatePurchaseOrderDto } from './dto/create-purchase-order.dto';
import { POItem } from './po-item.entity';

@Injectable()
export class PurchaseOrdersService {
  constructor(
    @InjectRepository(PurchaseOrder)
    private poRepo: Repository<PurchaseOrder>,

    @InjectRepository(Vendor)
    private vendorRepo: Repository<Vendor>,

    @InjectRepository(POItem)
    private itemRepo: Repository<POItem>,
  ) {}

  async createPO(dto: CreatePurchaseOrderDto) {
 
    const vendor = await this.vendorRepo.findOne({
      where: { id: dto.vendorId },
    });

    if (!vendor) {
      throw new NotFoundException('Vendor not found');
    }

    if (vendor.status === 'Inactive') {
      throw new BadRequestException('Cannot create PO for inactive vendor');
    }


    let totalAmount = 0;
    dto.items.forEach((item) => {
      totalAmount += item.quantity * item.unitPrice;
    });


    const poDate = new Date();


const dueDate = new Date(poDate);
dueDate.setDate(dueDate.getDate() + vendor.paymentTerms);



    const today = new Date();
    const datePart = today.toISOString().slice(0, 10).replace(/-/g, '');
    const count = await this.poRepo.count();
    const poNumber = `PO-${datePart}-${count + 1}`;


    const po = this.poRepo.create({
      poNumber,
      vendor,
      poDate,
      dueDate,
      totalAmount,
      status: 'Approved',
      items: dto.items.map((i) =>
        this.itemRepo.create({
          description: i.description,
          quantity: i.quantity,
          unitPrice: i.unitPrice,
        }),
      ),
    });

    return this.poRepo.save(po);
  }

  findAll() {
    return this.poRepo.find({
      relations: ['vendor', 'items'],
    });
  }
}
