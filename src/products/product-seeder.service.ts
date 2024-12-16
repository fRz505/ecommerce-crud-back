import { Injectable } from '@nestjs/common';
import { Product } from '../entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../entities/category.entity';

@Injectable()
export class ProductSeederService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  private readonly products = [
    {
      name: 'Iphone 15',
      description: 'The best smartphone in the world',
      price: 199.99,
      stock: 12,
      imgUrl: 'url_to_image',
      category: 'smartphone',
    },
    {
      name: 'Samsung Galaxy S23',
      description: 'The best smartphone in the world',
      price: 150.0,
      stock: 12,
      imgUrl: 'url_to_image',
      category: 'smartphone',
    },
    {
      name: 'Motorola Edge 40',
      description: 'The best smartphone in the world',
      price: 179.89,
      stock: 12,
      imgUrl: 'url_to_image',
      category: 'smartphone',
    },
    {
      name: 'Samsung Odyssey G9',
      description: 'The best monitor in the world',
      price: 299.99,
      stock: 12,
      imgUrl: 'url_to_image',
      category: 'monitor',
    },
    {
      name: 'LG UltraGear',
      description: 'The best monitor in the world',
      price: 199.99,
      stock: 12,
      imgUrl: 'url_to_image',
      category: 'monitor',
    },
    {
      name: 'Acer Predator',
      description: 'The best monitor in the world',
      price: 150.0,
      stock: 12,
      imgUrl: 'url_to_image',
      category: 'monitor',
    },
    {
      name: 'Razer BlackWidow V3',
      description: 'The best keyboard in the world',
      price: 99.99,
      stock: 12,
      imgUrl: 'url_to_image',
      category: 'keyboard',
    },
    {
      name: 'Corsair K70',
      description: 'The best keyboard in the world',
      price: 79.99,
      stock: 12,
      imgUrl: 'url_to_image',
      category: 'keyboard',
    },
    {
      name: 'Logitech G Pro',
      description: 'The best keyboard in the world',
      price: 59.99,
      stock: 12,
      imgUrl: 'url_to_image',
      category: 'keyboard',
    },
    {
      name: 'Razer Viper',
      description: 'The best mouse in the world',
      price: 49.99,
      stock: 12,
      imgUrl: 'url_to_image',
      category: 'mouse',
    },
    {
      name: 'Logitech G502 Pro',
      description: 'The best mouse in the world',
      price: 39.99,
      stock: 12,
      imgUrl: 'url_to_image',
      category: 'mouse',
    },
    {
      name: 'SteelSeries Rival 3',
      description: 'The best mouse in the world',
      price: 29.99,
      stock: 12,
      imgUrl: 'url_to_image',
      category: 'mouse',
    },
  ];

  async seedProducts(): Promise<void> {
    for (const product of this.products) {
      const category = await this.categoryRepository.findOne({
        where: { name: product.category },
      });

      if (!category) {
        throw new Error(`Category with name ${product.category} not found`);
      }

      const existingProduct = await this.productRepository.findOne({
        where: { name: product.name },
      });

      if (!existingProduct) {
        const newProduct = this.productRepository.create({
          name: product.name,
          description: product.description,
          price: product.price,
          stock: product.stock,
          imgUrl: product.imgUrl,
          category: category,
        });

        await this.productRepository.save(newProduct);
      }
    }
  }
}
