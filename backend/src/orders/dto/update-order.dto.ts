import { IsString, IsOptional, IsNumber, IsEnum, IsDateString } from 'class-validator';

export class UpdateOrderDto {
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
  @IsEnum(['quoted', 'confirmed', 'baking', 'packed', 'delivered', 'cancelled'])
  status?: string;

  @IsOptional()
  @IsNumber()
  totalPrice?: number;

  @IsOptional()
  @IsNumber()
  paidAmount?: number;

  @IsOptional()
  @IsDateString()
  deliveryDate?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
