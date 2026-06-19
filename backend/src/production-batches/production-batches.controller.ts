import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ProductionBatchesService } from './production-batches.service';
import { CreateProductionBatchDto } from './dto/create-production-batch.dto';
import { UpdateProductionBatchDto } from './dto/update-production-batch.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('production-batches')
@UseGuards(JwtAuthGuard)
export class ProductionBatchesController {
  constructor(private readonly productionBatchesService: ProductionBatchesService) {}

  @Get()
  findAll(@Request() req: any) {
    return this.productionBatchesService.findAll(req.user.bakeryId);
  }

  @Post()
  create(@Body() dto: CreateProductionBatchDto, @Request() req: any) {
    return this.productionBatchesService.create(dto, req.user.bakeryId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateProductionBatchDto, @Request() req: any) {
    return this.productionBatchesService.update(id, dto, req.user.bakeryId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req: any) {
    return this.productionBatchesService.remove(id, req.user.bakeryId);
  }
}
