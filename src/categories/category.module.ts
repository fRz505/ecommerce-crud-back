import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from '../entities/category.entity';
import { CategoryRepository } from './category.repository';
import { CategorySeederService } from './category.service';
import { CategorySeederController } from './category.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Category])],
  controllers: [CategorySeederController],
  providers: [CategorySeederService, CategoryRepository],
  exports: [CategoryRepository],
})
export class CategoryModule {}
