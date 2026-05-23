import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { StoresModule } from './stores/stores.module';
import { CashiersModule } from './cashiers/cashiers.module';
import { ShiftsModule } from './shifts/shifts.module';
import { CategoriesModule } from './categories/categories.module';
import { ProductsModule } from './products/products.module';
import { StockModule } from './stock/stock.module';
import { SuppliersModule } from './suppliers/suppliers.module';
import { PurchasesModule } from './purchases/purchases.module';
import { CustomersModule } from './customers/customers.module';
import { DiscountsModule } from './discounts/discounts.module';
import { SalesModule } from './sales/sales.module';
import { PaymentsModule } from './payments/payments.module';
import { CartsModule } from './carts/carts.module';
import { ReturnsModule } from './returns/returns.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { ReportsModule } from './reports/reports.module';
import { UploadsModule } from './uploads/uploads.module';
import { PrismaModule } from './prisma/prisma.module';
import { BarcodesModule } from './barcodes/barcodes.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    UsersModule,
    StoresModule,
    CashiersModule,
    ShiftsModule,
    CategoriesModule,
    ProductsModule,
    StockModule,
    SuppliersModule,
    PurchasesModule,
    CustomersModule,
    DiscountsModule,
    SalesModule,
    PaymentsModule,
    CartsModule,
    ReturnsModule,
    DashboardModule,
    ReportsModule,
    UploadsModule,
    PrismaModule,
    BarcodesModule,
  ],

  controllers: [AppController],

  providers: [AppService],
})
export class AppModule {}