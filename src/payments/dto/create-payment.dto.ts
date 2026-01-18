import {
  IsDateString,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsPositive,
} from 'class-validator';

export class CreatePaymentDto {
  @IsNumber()
  purchaseOrderId: number;

  @IsDateString()
  paymentDate: string;

  @IsNumber()
  @IsPositive()
  amount: number;

  @IsIn(['Cash', 'Cheque', 'NEFT', 'RTGS', 'UPI'])
  method: 'Cash' | 'Cheque' | 'NEFT' | 'RTGS' | 'UPI';

  @IsNotEmpty()
  notes?: string;
}
