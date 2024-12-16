import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Order } from '../entities/order.entity';
import { OrderDetail } from '../entities/order-detail.entity';
import { Product } from '../entities/product.entity';
import { User } from '../entities/user.entity';

@Injectable()
export class OrdersRepository {
  constructor(
    @InjectRepository(Order) private ordersRepository: Repository<Order>,
    @InjectRepository(Product) private productsRepository: Repository<Product>,
    @InjectRepository(User) private usersRepository: Repository<User>,
    @InjectRepository(OrderDetail)
    private orderDetailsRepository: Repository<OrderDetail>,
  ) {}

  async addOrder(userId: string, productIds: string[]): Promise<Order> {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) throw new Error('User not found');

    const products = await this.productsRepository.find({
      where: { id: In(productIds) },
    });

    const order = this.ordersRepository.create({
      user,
      totalPrice: 0,
      orderDetails: [],
    });

    let totalPrice = 0;
    for (const product of products) {
      if (product.stock > 0) {
        const orderDetail = new OrderDetail();
        orderDetail.price = Number(product.price);
        orderDetail.quantity = 1;
        orderDetail.product = product;

        totalPrice += orderDetail.price;
        order.orderDetails.push(orderDetail);

        product.stock -= 1;
        await this.productsRepository.save(product);

        await this.orderDetailsRepository.save(orderDetail);
      }
    }

    order.totalPrice = totalPrice;
    await this.ordersRepository.save(order);

    return order;
  }

  async getOrder(orderId: string): Promise<Order | undefined> {
    return this.ordersRepository.findOne({
      where: { id: orderId },
      relations: ['orderDetails', 'orderDetails.product'],
    });
  }
}
