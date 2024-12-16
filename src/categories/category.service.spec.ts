import { Test, TestingModule } from '@nestjs/testing';
import { CategorySeederService } from './category.service';
import { CategoryRepository } from './category.repository';

describe('CategorySeederService', () => {
  let service: CategorySeederService;
  let categoryRepository: CategoryRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategorySeederService,
        {
          provide: CategoryRepository,
          useValue: {
            addCategories: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CategorySeederService>(CategorySeederService);
    categoryRepository = module.get<CategoryRepository>(CategoryRepository);
  });

  describe('seedCategories', () => {
    it('should seed categories successfully', async () => {
      const categories = [{ name: 'Electronics' }, { name: 'Clothing' }];

      categoryRepository.addCategories = jest.fn().mockResolvedValue(undefined);

      await service.seedCategories(categories);

      expect(categoryRepository.addCategories).toHaveBeenCalledWith([
        'Electronics',
        'Clothing',
      ]);
    });
  });
});
