import { Controller, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CategorySeederService } from './category.service';

@ApiTags('Categories')
@Controller('categories')
export class CategorySeederController {
  constructor(private readonly categorySeederService: CategorySeederService) {}

  @Post('seeder')
  @ApiOperation({ summary: 'Sembrar categorías en la base de datos' })
  @ApiResponse({
    status: 201,
    description: 'Las categorías se han sembrado correctamente.',
    schema: {
      example: 'Categories seeded successfully',
    },
  })
  async seedCategories(): Promise<string> {
    const categories = [
      { name: 'smartphone' },
      { name: 'monitor' },
      { name: 'keyboard' },
      { name: 'mouse' },
    ];
    await this.categorySeederService.seedCategories(categories);
    return 'Categories seeded successfully';
  }
}
