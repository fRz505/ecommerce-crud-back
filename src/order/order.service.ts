import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { OrdersRepository } from './order.repository';
import { Order } from '../entities/order.entity';

@Injectable()
export class OrdersService {
  constructor(private readonly ordersRepository: OrdersRepository) {}

  async addOrder(userId: string, productIds: string[]): Promise<Order> {
    try {
      const order = await this.ordersRepository.addOrder(userId, productIds);
      return order;
    } catch {
      throw new BadRequestException('Invalid data or product out of stock');
    }
  }

  async getOrder(orderId: string): Promise<Order | undefined> {
    try {
      const order = await this.ordersRepository.getOrder(orderId);

      if (!order) {
        throw new NotFoundException('Order not found');
      }
      return order;
    } catch {
      throw new Error('Error retrieving order');
    }
  }
}
