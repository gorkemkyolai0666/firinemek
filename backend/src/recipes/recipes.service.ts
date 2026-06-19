import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRecipeDto, UpdateRecipeDto } from './dto/recipe.dto';

@Injectable()
export class RecipesService {
  constructor(private readonly prisma: PrismaService) { }

  async findAll(bakeryId: string) {
    return this.prisma.recipe.findMany({
      where: { bakeryId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(dto: CreateRecipeDto, bakeryId: string) {
    return this.prisma.recipe.create({
      data: {
        name: dto.name,
        flourType: dto.flourType || '',
        category: (dto.category as any) || 'white_bread',
        hydrationPct: dto.hydrationPct ?? 65,
        fermentHours: dto.fermentHours ?? 12,
        bakeTemp: dto.bakeTemp ?? 220,
        bakeMinutes: dto.bakeMinutes ?? 35,
        description: dto.description || '',
        bakeryId,
      },
    });
  }

  async update(id: string, dto: UpdateRecipeDto, bakeryId: string) {
    const recipe = await this.prisma.recipe.findFirst({ where: { id, bakeryId } });
    if (!recipe) throw new NotFoundException('Tarif bulunamadı');

    const data: Record<string, unknown> = { ...dto };
    if (dto.category) data.category = dto.category as any;

    return this.prisma.recipe.update({ where: { id }, data });
  }
}
