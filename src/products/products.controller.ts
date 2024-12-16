import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Query,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { AuthGuard } from '../auth/auth.guard';
import { RoleGuard } from '../auth/role.guard';
import {
  CreateProductDto,
  UpdateProductDto,
  ProductResponseDto,
} from '../dtos/product.dto';
import { validate as isUuid } from 'uuid';
import { Roles } from '../auth/roles.decorator';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener todos los productos' })
  @ApiResponse({
    status: 200,
    description: 'Lista de productos obtenida correctamente',
    type: [ProductResponseDto],
  })
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 30,
  ): Promise<ProductResponseDto[]> {
    return this.productsService.findAll(page, limit);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un producto por su ID' })
  @ApiResponse({
    status: 200,
    description: 'Producto obtenido correctamente',
    type: ProductResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Formato UUID no válido' })
  async findOne(@Param('id') id: string): Promise<ProductResponseDto> {
    if (!isUuid(id)) {
      throw new BadRequestException('Formato UUID no válido');
    }
    return this.productsService.findOne(id);
  }

  @Post()
  @UseGuards(AuthGuard, RoleGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Crear un nuevo producto' })
  @ApiResponse({
    status: 201,
    description: 'Producto creado correctamente',
    type: ProductResponseDto,
  })
  async create(
    @Body() createProductDto: CreateProductDto,
  ): Promise<ProductResponseDto[]> {
    await this.productsService.create(createProductDto);
    return this.productsService.findAll(1, 100);
  }

  @Put(':id')
  @UseGuards(AuthGuard, RoleGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Actualizar un producto existente' })
  @ApiResponse({
    status: 200,
    description: 'Producto actualizado correctamente',
    type: ProductResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Formato UUID no válido' })
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<ProductResponseDto> {
    if (!isUuid(id)) {
      throw new BadRequestException('Formato UUID no válido');
    }
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard, RoleGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Eliminar un producto' })
  @ApiResponse({
    status: 200,
    description: 'Producto eliminado con éxito',
    schema: {
      example: { message: 'Producto eliminado con exito' },
    },
  })
  @ApiResponse({ status: 400, description: 'Formato UUID no válido' })
  async remove(@Param('id') id: string): Promise<{ message: string }> {
    if (!isUuid(id)) {
      throw new BadRequestException('Formato UUID no válido');
    }
    await this.productsService.remove(id);
    return { message: 'Producto eliminado con exito' };
  }
}
