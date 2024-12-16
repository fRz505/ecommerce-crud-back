import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { ProductsRepository } from './products.repository';
import { CategoryRepository } from '../categories/category.repository';
import { NotFoundException } from '@nestjs/common';
import { CreateProductDto } from '../dtos/product.dto';

describe('ProductsService (Unit Tests)', () => {
  let service: ProductsService;
  let productsRepository: ProductsRepository;
  let categoriesRepository: CategoryRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: ProductsRepository,
          useValue: {
            findAll: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
        {
          provide: CategoryRepository,
          useValue: {
            findOneById: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    productsRepository = module.get<ProductsRepository>(ProductsRepository);
    categoriesRepository = module.get<CategoryRepository>(CategoryRepository);
  });

  describe('create', () => {
    it('should create a new product successfully', async () => {
      const createProductDto: CreateProductDto = {
        name: 'Product Test',
        description: 'Description Test',
        price: 100,
        stock: 10,
        imgUrl: 'http://example.com/product.jpg',
        categoryId: 'category-id',
      };

      const category = { id: 'category-id', name: 'Category Test' };
      const newProduct = {
        id: 'product-id',
        ...createProductDto,
        category,
      };

      categoriesRepository.findOneById = jest.fn().mockResolvedValue(category);
      productsRepository.create = jest.fn().mockResolvedValue(newProduct);

      const result = await service.create(createProductDto);

      expect(result).toEqual({
        id: 'product-id',
        name: 'Product Test',
        description: 'Description Test',
        price: 100,
        stock: 10,
        imgUrl: 'http://example.com/product.jpg',
        categoryId: 'category-id',
      });
      expect(categoriesRepository.findOneById).toHaveBeenCalledWith(
        'category-id',
      );
      expect(productsRepository.create).toHaveBeenCalledWith(
        createProductDto,
        category,
      );
    });

    it('should throw a NotFoundException if category not found', async () => {
      const createProductDto: CreateProductDto = {
        name: 'Product Test',
        description: 'Description Test',
        price: 100,
        stock: 10,
        imgUrl: 'http://example.com/product.jpg',
        categoryId: 'category-id',
      };

      categoriesRepository.findOneById = jest.fn().mockResolvedValue(null);

      await expect(service.create(createProductDto)).rejects.toThrow(
        new NotFoundException('Category not found'),
      );
    });
  });
});
