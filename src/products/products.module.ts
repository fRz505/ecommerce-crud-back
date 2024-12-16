import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { ProductsRepository } from './products.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from 'src/entities/product.entity';
import { Category } from 'src/entities/category.entity';
import { CategoryModule } from 'src/categories/category.module';
import { ProductSeederService } from './product-seeder.service';
import { ProductSeederController } from './product-seeder.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, Category]),
    CategoryModule,
    AuthModule,
  ],
  controllers: [ProductsController, ProductSeederController],
  providers: [ProductsService, ProductsRepository, ProductSeederService],
  exports: [ProductsRepository],
})
export class ProductsModule {}
