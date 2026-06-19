import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) { }

  async findAll(bakeryId: string) {
    return this.prisma.order.findMany({
      where: { bakeryId },
      include: { customer: true, recipe: true },
      orderBy: { orderDate: 'desc' },
    });
  }

  async create(dto: CreateOrderDto, bakeryId: string) {
    return this.prisma.order.create({
      data: {
        customerId: dto.customerId,
        recipeId: dto.recipeId || null,
        productName: dto.productName || '',
        quantityUnits: dto.quantityUnits ?? 50,
        productCategory: (dto.productCategory as any) || 'white_bread',
        totalPrice: dto.totalPrice || 0,
        paidAmount: dto.paidAmount || 0,
        orderDate: new Date(dto.orderDate),
        deliveryDate: dto.deliveryDate ? new Date(dto.deliveryDate) : null,
        notes: dto.notes || '',
        bakeryId,
      },
      include: { customer: true, recipe: true },
    });
  }

  async update(id: string, dto: UpdateOrderDto, bakeryId: string) {
    const order = await this.prisma.order.findFirst({ where: { id, bakeryId } });
    if (!order) throw new NotFoundException('Sipariş bulunamadı');

    const data: Record<string, unknown> = { ...dto };
    if (dto.productCategory) data.productCategory = dto.productCategory as any;
    if (dto.status) data.status = dto.status as any;
    if (dto.deliveryDate) data.deliveryDate = new Date(dto.deliveryDate);

    return this.prisma.order.update({
      where: { id },
      data,
      include: { customer: true, recipe: true },
    });
  }
}
