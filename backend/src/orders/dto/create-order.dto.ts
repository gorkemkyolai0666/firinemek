import { IsString, IsOptional, IsNumber, IsEnum, IsDateString } from 'class-validator';

export class CreateOrderDto {
  @IsString()
  customerId: string;

  @IsOptional()
  @IsString()
  recipeId?: string;

  @IsOptional()
  @IsString()
  productName?: string;

  @IsOptional()
  @IsNumber()
  quantityUnits?: number;

  @IsOptional()
  @IsEnum(['sourdough', 'white_bread', 'pastry', 'viennoiserie', 'special'])
  productCategory?: string;

  @IsOptional()
  @IsNumber()
  totalPrice?: number;

  @IsOptional()
  @IsNumber()
  paidAmount?: number;

  @IsDateString()
  orderDate: string;

  @IsOptional()
  @IsDateString()
  deliveryDate?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
