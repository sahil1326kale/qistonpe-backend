import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vendor } from './vendor.entity';
import { CreateVendorDto } from './dto/create-vendor.dto';

@Injectable()
export class VendorsService {
  constructor(
    @InjectRepository(Vendor)
    private vendorRepo: Repository<Vendor>,
  ) {}

  async createVendor(dto: CreateVendorDto) {
    const existing = await this.vendorRepo.findOne({
      where: [{ name: dto.name }, { email: dto.email }],
    });

    if (existing) {
      throw new ConflictException('Vendor already exists');
    }

    const vendor = this.vendorRepo.create(dto);
    return this.vendorRepo.save(vendor);
  }

  findAll() {
    return this.vendorRepo.find();
  }
}
