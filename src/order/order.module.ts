import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersRepository } from './order.repository';
import { OrdersService } from './order.service';
import { OrdersController } from './order.controller';
import { Order } from '../entities/order.entity';
import { OrderDetail } from '../entities/order-detail.entity';
import { Product } from '../entities/product.entity';
import { User } from '../entities/user.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderDetail, Product, User]),
    AuthModule,
  ],
  providers: [OrdersRepository, OrdersService],
  controllers: [OrdersController],
})
export class OrdersModule {}
