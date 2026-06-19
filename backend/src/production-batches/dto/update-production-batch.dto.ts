import { IsString, IsOptional, IsNumber, IsEnum, IsDateString } from 'class-validator';

export class UpdateProductionBatchDto {
  @IsOptional()
  @IsDateString()
  date?: string;

  @IsOptional()
  @IsNumber()
  duration?: number;

  @IsOptional()
  @IsEnum(['daily_bread', 'pastry_batch', 'special_order', 'trial', 'training'])
  type?: string;

  @IsOptional()
  @IsEnum(['planned', 'in_progress', 'cooling', 'completed', 'cancelled'])
  status?: string;

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
