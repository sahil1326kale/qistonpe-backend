import { IsEmail, IsIn, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateVendorDto {
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsNumber()
  @IsIn([7, 15, 30, 45, 60])
  paymentTerms: number;

  @IsIn(['Active', 'Inactive'])
  status: 'Active' | 'Inactive';
}
