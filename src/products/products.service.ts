import { Injectable, NotFoundException } from '@nestjs/common';
import { ProductsRepository } from './products.repository';
import { Product } from '../entities/product.entity';
import {
  CreateProductDto,
  ProductResponseDto,
  UpdateProductDto,
} from '../dtos/product.dto';
import { CategoryRepository } from '../categories/category.repository';

@Injectable()
export class ProductsService {
  constructor(
    private readonly productsRepository: ProductsRepository,
    private readonly categoriesRepository: CategoryRepository,
  ) {}

  async findAll(page: number, limit: number): Promise<ProductResponseDto[]> {
    const products = await this.productsRepository.findAll(page, limit);
    return products.map(this.toDto);
  }

  async findOne(id: string): Promise<ProductResponseDto> {
    const product = await this.productsRepository.findOne(id);
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return this.toDto(product);
  }

  async create(
    createProductDto: CreateProductDto,
  ): Promise<ProductResponseDto> {
    const category = await this.categoriesRepository.findOneById(
      createProductDto.categoryId,
    );
    if (!category) {
      throw new NotFoundException('Category not found');
    }

    const newProduct = await this.productsRepository.create(
      createProductDto,
      category,
    );
    return this.toDto(newProduct);
  }
  async update(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<ProductResponseDto> {
    const updatedProduct = await this.productsRepository.update(
      id,
      updateProductDto,
    );
    if (!updatedProduct) {
      throw new NotFoundException('Product not found');
    }
    return this.toDto(updatedProduct);
  }

  async remove(id: string): Promise<void> {
    const product = await this.productsRepository.findOne(id);
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    await this.productsRepository.remove(id);
  }

  private toDto(product: Product): ProductResponseDto {
    return {
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      imgUrl: product.imgUrl,
      categoryId: product.category?.id || '',
    };
  }
}
