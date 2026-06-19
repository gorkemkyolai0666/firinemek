import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductionBatchDto } from './dto/create-production-batch.dto';
import { UpdateProductionBatchDto } from './dto/update-production-batch.dto';

@Injectable()
export class ProductionBatchesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(bakeryId: string) {
    return this.prisma.productionBatch.findMany({
      where: { bakeryId },
      include: { customer: true },
      orderBy: { date: 'asc' },
    });
  }

  async create(dto: CreateProductionBatchDto, bakeryId: string) {
    return this.prisma.productionBatch.create({
      data: {
        date: new Date(dto.date),
        duration: dto.duration || 45,
        type: (dto.type as any) || 'daily_bread',
        notes: dto.notes || '',
        bakerName: dto.bakerName || '',
        quantityUnits: dto.quantityUnits ?? 50,
        customerId: dto.customerId,
        bakeryId,
      },
      include: { customer: true },
    });
  }

  async update(id: string, dto: UpdateProductionBatchDto, bakeryId: string) {
    const productionBatch = await this.prisma.productionBatch.findFirst({ where: { id, bakeryId } });
    if (!productionBatch) throw new NotFoundException('Üretim partisi bulunamadı');

    const data: Record<string, unknown> = { ...dto };
    if (dto.date) data.date = new Date(dto.date);
    if (dto.status) data.status = dto.status as any;
    if (dto.type) data.type = dto.type as any;

    return this.prisma.productionBatch.update({
      where: { id },
      data,
      include: { customer: true },
    });
  }

  async remove(id: string, bakeryId: string) {
    const productionBatch = await this.prisma.productionBatch.findFirst({ where: { id, bakeryId } });
    if (!productionBatch) throw new NotFoundException('Üretim partisi bulunamadı');
    return this.prisma.productionBatch.delete({ where: { id } });
  }
}
