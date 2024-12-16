import { Injectable } from '@nestjs/common';
import { CategoryRepository } from './category.repository';

@Injectable()
export class CategorySeederService {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async seedCategories(categories: { name: string }[]): Promise<void> {
    await this.categoryRepository.addCategories(categories.map((c) => c.name));
  }
}
