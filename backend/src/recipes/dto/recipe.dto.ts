import { IsString, IsOptional, IsNumber, IsEnum } from 'class-validator';

export class CreateRecipeDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  flourType?: string;

  @IsOptional()
  @IsEnum(['sourdough', 'white_bread', 'pastry', 'viennoiserie', 'special'])
  category?: string;

  @IsOptional()
  @IsNumber()
  hydrationPct?: number;

  @IsOptional()
  @IsNumber()
  fermentHours?: number;

  @IsOptional()
  @IsNumber()
  bakeTemp?: number;

  @IsOptional()
  @IsNumber()
  bakeMinutes?: number;

  @IsOptional()
  @IsString()
  description?: string;
}

export class UpdateRecipeDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  flourType?: string;

  @IsOptional()
  @IsEnum(['sourdough', 'white_bread', 'pastry', 'viennoiserie', 'special'])
  category?: string;

  @IsOptional()
  @IsNumber()
  hydrationPct?: number;

  @IsOptional()
  @IsNumber()
  fermentHours?: number;

  @IsOptional()
  @IsNumber()
  bakeTemp?: number;

  @IsOptional()
  @IsNumber()
  bakeMinutes?: number;

  @IsOptional()
  @IsString()
  description?: string;
}
