import {
  IsArray,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreatePOItemDto } from './create-po-item.dto';

export class CreatePurchaseOrderDto {
  @IsNumber()
  vendorId: number;

  @IsDateString()
  poDate: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePOItemDto)
  items: CreatePOItemDto[];
}
