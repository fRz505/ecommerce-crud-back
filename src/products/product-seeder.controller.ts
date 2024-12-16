import { Controller, Post, InternalServerErrorException } from '@nestjs/common';
import { ProductSeederService } from './product-seeder.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Products')
@Controller('products')
export class ProductSeederController {
  constructor(private readonly productSeederService: ProductSeederService) {}

  @Post('seeder')
  @ApiOperation({
    summary: 'Sembrar productos en la base de datos',
    description:
      'Permite sembrar productos en la base de datos con un servicio.',
  })
  @ApiResponse({
    status: 200,
    description: 'Productos sembrados correctamente',
  })
  @ApiResponse({
    status: 500,
    description: 'Error al sembrar los productos',
  })
  async seedProducts(): Promise<string> {
    try {
      await this.productSeederService.seedProducts();
      return 'Productos sembrados correctamente';
    } catch (error) {
      console.error('Error al sembrar productos:', error);
      throw new InternalServerErrorException('Error al sembrar los productos');
    }
  }
}
