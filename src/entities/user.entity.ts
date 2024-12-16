import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Order } from './order.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50 })
  name: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  password: string;

  @Column({ type: 'varchar', length: 15, nullable: true })
  phone?: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  country?: string;

  @Column({ type: 'text', nullable: true })
  address?: string;

  @Column({ type: 'timestamp', nullable: true })
  fecha?: Date;

  @Column({ type: 'varchar', length: 50, nullable: true })
  city?: string;

  @Column('simple-array', { default: ['user'] })
  roles: string[];

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];
}
