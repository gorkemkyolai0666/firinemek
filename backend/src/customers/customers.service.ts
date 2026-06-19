import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Injectable()
export class CustomersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(bakeryId: string) {
    return this.prisma.customer.findMany({
      where: { bakeryId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, bakeryId: string) {
    const customer = await this.prisma.customer.findFirst({
      where: { id, bakeryId },
      include: {
        productionBatches: { orderBy: { date: 'desc' }, take: 5 },
        orders: { orderBy: { orderDate: 'desc' }, take: 5 },
      },
    });
    if (!customer) throw new NotFoundException('Müşteri bulunamadı');
    return customer;
  }

  async create(dto: CreateCustomerDto, bakeryId: string) {
    return this.prisma.customer.create({
      data: {
        companyName: dto.companyName,
        contactName: dto.contactName || '',
        phone: dto.phone,
        email: dto.email || '',
        address: dto.address || '',
        city: dto.city || '',
        notes: dto.notes || '',
        bakeryId,
      },
    });
  }

  async update(id: string, dto: UpdateCustomerDto, bakeryId: string) {
    const customer = await this.prisma.customer.findFirst({ where: { id, bakeryId } });
    if (!customer) throw new NotFoundException('Müşteri bulunamadı');
    return this.prisma.customer.update({ where: { id }, data: dto });
  }

  async remove(id: string, bakeryId: string) {
    const customer = await this.prisma.customer.findFirst({ where: { id, bakeryId } });
    if (!customer) throw new NotFoundException('Müşteri bulunamadı');

    await this.prisma.order.deleteMany({ where: { customerId: id } });
    await this.prisma.productionBatch.deleteMany({ where: { customerId: id } });

    return this.prisma.customer.delete({ where: { id } });
  }
}
