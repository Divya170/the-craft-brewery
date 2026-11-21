import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { ProductsAdminController, ProductsController, StylesAdminController } from './products.controller';
import { ProductsService } from './products.service';
import { Style } from './style.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Style])],
  controllers: [ProductsController, StylesAdminController, ProductsAdminController],
  providers: [ProductsService],
  exports: [ProductsService],
})
export class ProductsModule {}
