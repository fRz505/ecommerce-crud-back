import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  NotFoundException,
  InternalServerErrorException,
  UseGuards,
} from '@nestjs/common';
import { OrdersService } from './order.service';
import { Order } from '../entities/order.entity';
import { CreateOrderDto } from 'src/dtos/createOrder.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Crear una nueva orden',
    description:
      'Permite crear una nueva orden asociada a un usuario y productos.',
  })
  @ApiResponse({
    status: 201,
    description: 'Orden creada correctamente',
  })
  @ApiResponse({
    status: 400,
    description: 'Datos de la orden no válidos',
  })
  @ApiResponse({
    status: 404,
    description: 'Usuario o productos no encontrados',
  })
  @ApiResponse({
    status: 500,
    description: 'Error al crear la orden',
  })
  async addOrder(@Body() createOrderDto: CreateOrderDto): Promise<Order> {
    try {
      const { userId, products } = createOrderDto;
      const productIds = products.map((product) => product.id);
      return await this.ordersService.addOrder(userId, productIds);
    } catch (error) {
      if (error.response && error.response === 'User not found') {
        throw new NotFoundException('Usuario no encontrado');
      }
      if (error.response && error.response === 'Product not found') {
        throw new NotFoundException('Algunos productos no encontrados');
      }
      throw new InternalServerErrorException('Error al crear la orden');
    }
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Obtener una orden por ID',
    description: 'Permite obtener una orden específica por su ID.',
  })
  @ApiResponse({
    status: 200,
    description: 'Orden encontrada',
  })
  @ApiResponse({
    status: 404,
    description: 'Orden no encontrada',
  })
  @ApiResponse({
    status: 500,
    description: 'Error al obtener la orden',
  })
  async getOrder(@Param('id') id: string): Promise<Order | undefined> {
    try {
      const order = await this.ordersService.getOrder(id);
      if (!order) {
        throw new NotFoundException('Orden no encontrada');
      }
      return order;
    } catch {
      throw new InternalServerErrorException('Error al obtener la orden');
    }
  }
}
