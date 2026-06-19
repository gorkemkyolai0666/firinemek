import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { HealthModule } from './health/health.module';
import { CustomersModule } from './customers/customers.module';
import { ProductionBatchesModule } from './production-batches/production-batches.module';
import { OrdersModule } from './orders/orders.module';
import { RecipesModule } from './recipes/recipes.module';
import { IngredientsModule } from './ingredients/ingredients.module';
import { DashboardModule } from './dashboard/dashboard.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    HealthModule,
    CustomersModule,
    ProductionBatchesModule,
    OrdersModule,
    RecipesModule,
    IngredientsModule,
    DashboardModule,
  ],
})
export class AppModule {}
