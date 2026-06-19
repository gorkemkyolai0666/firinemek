import { IsString, IsOptional, IsNumber, IsEnum, IsInt } from 'class-validator';

export class CreateIngredientDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsEnum(['flour', 'dairy', 'yeast', 'sugar', 'grain', 'other'])
  category?: string;

  @IsOptional()
  @IsEnum(['dry', 'refrigerated', 'frozen', 'ambient'])
  storage?: string;

  @IsOptional()
  @IsNumber()
  stockKg?: number;

  @IsOptional()
  @IsNumber()
  unitCost?: number;

  @IsOptional()
  @IsString()
  supplier?: string;

  @IsOptional()
  @IsInt()
  batchYear?: number;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateIngredientDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEnum(['flour', 'dairy', 'yeast', 'sugar', 'grain', 'other'])
  category?: string;

  @IsOptional()
  @IsEnum(['dry', 'refrigerated', 'frozen', 'ambient'])
  storage?: string;

  @IsOptional()
  @IsNumber()
  stockKg?: number;

  @IsOptional()
  @IsNumber()
  unitCost?: number;

  @IsOptional()
  @IsString()
  supplier?: string;

  @IsOptional()
  @IsInt()
  batchYear?: number;

  @IsOptional()
  @IsString()
  notes?: string;
}
