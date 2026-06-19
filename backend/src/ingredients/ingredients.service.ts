import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateIngredientDto, UpdateIngredientDto } from './dto/ingredient.dto';

@Injectable()
export class IngredientsService {
  constructor(private readonly prisma: PrismaService) { }

  async findAll(bakeryId: string) {
    return this.prisma.ingredient.findMany({
      where: { bakeryId },
      orderBy: { name: 'asc' },
    });
  }

  async create(dto: CreateIngredientDto, bakeryId: string) {
    return this.prisma.ingredient.create({
      data: {
        name: dto.name,
        category: (dto.category as any) || 'other',
        storage: (dto.storage as any) || 'dry',
        stockKg: dto.stockKg ?? 0,
        unitCost: dto.unitCost ?? 0,
        supplier: dto.supplier || '',
        batchYear: dto.batchYear ?? 2024,
        notes: dto.notes || '',
        bakeryId,
      },
    });
  }

  async update(id: string, dto: UpdateIngredientDto, bakeryId: string) {
    const ingredient = await this.prisma.ingredient.findFirst({ where: { id, bakeryId } });
    if (!ingredient) throw new NotFoundException('Hammadde bulunamadı');

    const data: Record<string, unknown> = { ...dto };
    if (dto.category) data.category = dto.category as any;
    if (dto.storage) data.storage = dto.storage as any;

    return this.prisma.ingredient.update({ where: { id }, data });
  }

  async remove(id: string, bakeryId: string) {
    const ingredient = await this.prisma.ingredient.findFirst({ where: { id, bakeryId } });
    if (!ingredient) throw new NotFoundException('Hammadde bulunamadı');
    return this.prisma.ingredient.delete({ where: { id } });
  }
}
