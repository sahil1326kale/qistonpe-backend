import { IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

export class CreatePOItemDto {
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @IsPositive()
  quantity: number;

  @IsNumber()
  @IsPositive()
  unitPrice: number;
}
