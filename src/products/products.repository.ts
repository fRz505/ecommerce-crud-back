import { Injectable } from '@nestjs/common';
import { Product } from '../entities/product.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateProductDto, UpdateProductDto } from '../dtos/product.dto';
import { Category } from '../entities/category.entity';

@Injectable()
export class ProductsRepository {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async create(
    createProductDto: CreateProductDto,
    category: Category,
  ): Promise<Product> {
    const product = this.productRepository.create({
      ...createProductDto,
      category,
    });
    return this.productRepository.save(product);
  }

  async findAll(page: number, limit: number): Promise<Product[]> {
    return this.productRepository.find({
      skip: (page - 1) * limit,
      take: limit,
    });
  }

  async findOne(id: string): Promise<Product | undefined> {
    return this.productRepository.findOne({
      where: { id },
      relations: ['category'],
    });
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<Product | undefined> {
    await this.productRepository.update(id, updateProductDto);
    return this.findOne(id);
  }

  async updateImage(
    productId: string,
    imageUrl: string,
  ): Promise<Product | null> {
    const product = await this.findOne(productId);
    if (!product) return null;

    product.imgUrl = imageUrl;
    return this.productRepository.save(product);
  }

  async remove(id: string): Promise<void> {
    await this.productRepository.delete(id);
  }
}
