import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../entities/category.entity';

@Injectable()
export class CategoryRepository {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async findOneByName(name: string): Promise<Category | undefined> {
    return this.categoryRepository.findOne({
      where: { name },
    });
  }

  async findOneById(id: string): Promise<Category | undefined> {
    return this.categoryRepository.findOne({
      where: { id },
    });
  }

  async getCategories(): Promise<Category[]> {
    return this.categoryRepository.find();
  }

  async addCategories(categoryNames: string[]): Promise<Category[]> {
    const existingCategories = await this.getCategories();
    const existingCategoryNames = existingCategories.map(
      (category) => category.name,
    );

    const newCategoryNames = categoryNames.filter(
      (name) => !existingCategoryNames.includes(name),
    );

    if (newCategoryNames.length > 0) {
      const categoriesToInsert = newCategoryNames.map((name) =>
        this.categoryRepository.create({ name }),
      );
      return this.categoryRepository.save(categoriesToInsert);
    }

    return [];
  }
}
