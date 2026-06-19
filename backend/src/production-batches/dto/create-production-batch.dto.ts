import { IsString, IsOptional, IsNumber, IsEnum, IsDateString } from 'class-validator';

export class CreateProductionBatchDto {
  @IsDateString()
  date: string;

  @IsString()
  customerId: string;

  @IsOptional()
  @IsNumber()
  duration?: number;

  @IsOptional()
  @IsEnum(['daily_bread', 'pastry_batch', 'special_order', 'trial', 'training'])
  type?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsString()
  bakerName?: string;

  @IsOptional()
  @IsNumber()
  quantityUnits?: number;
}
