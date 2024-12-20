import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { Product } from './entities/product.entity';
import { ProductFeature } from './entities/product-feature.entity';
import { CustomizationOption } from './entities/customization-option.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, ProductFeature, CustomizationOption])
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService]
})
export class ProductsModule {}