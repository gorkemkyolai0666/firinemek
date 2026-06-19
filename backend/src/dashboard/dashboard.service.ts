import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) { }

  async getStats(bakeryId: string) {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const todayEnd = new Date(todayStart.getTime() + 86400000);
    const weekEnd = new Date(todayStart.getTime() + 7 * 86400000);

    const [
      totalCustomers,
      todayProductionBatches,
      weekProductionBatches,
      pendingOrders,
      readyOrders,
      totalOrders,
      lowStockIngredients,
      recentCustomers,
      upcomingProductionBatches,
    ] = await Promise.all([
      this.prisma.customer.count({ where: { bakeryId } }),
      this.prisma.productionBatch.count({
        where: { bakeryId, date: { gte: todayStart, lt: todayEnd } },
      }),
      this.prisma.productionBatch.count({
        where: { bakeryId, date: { gte: todayStart, lt: weekEnd } },
      }),
      this.prisma.order.count({
        where: { bakeryId, status: { in: ['quoted', 'confirmed', 'baking'] } },
      }),
      this.prisma.order.count({
        where: { bakeryId, status: 'packed' },
      }),
      this.prisma.order.count({ where: { bakeryId } }),
      this.prisma.ingredient.count({
        where: { bakeryId, stockKg: { lt: 20 } },
      }),
      this.prisma.customer.findMany({
        where: { bakeryId },
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),
      this.prisma.productionBatch.findMany({
        where: {
          bakeryId,
          date: { gte: todayStart },
          status: { in: ['planned', 'in_progress'] },
        },
        include: { customer: true },
        orderBy: { date: 'asc' },
        take: 5,
      }),
    ]);

    return {
      totalCustomers,
      todayProductionBatches,
      weekProductionBatches,
      pendingOrders,
      readyOrders,
      totalOrders,
      lowStockIngredients,
      recentCustomers,
      upcomingProductionBatches,
    };
  }
}
