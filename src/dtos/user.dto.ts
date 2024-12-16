import { IsString, IsNotEmpty, IsOptional, IsEmail } from 'class-validator';
import { Exclude } from 'class-transformer';
import { User } from 'src/entities/user.entity';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsString()
  @IsNotEmpty()
  country: string;

  @IsString()
  @IsNotEmpty()
  city: string;
}

export class UpdateUserDto {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsString()
  city?: string;
}

export class UserResponseDto {
  id: string;
  name: string;
  email: string;
  orders?: { id: string; date: string }[];

  @Exclude()
  roles: string[];

  constructor(user: User) {
    if (!user || !user.id || !user.name || !user.email) {
      throw new Error('Missing required user properties');
    }
    this.id = user.id;
    this.name = user.name;
    this.email = user.email;
    this.orders = user.orders
      ? user.orders.map((order) => ({
          id: order.id,
          date: order.date.toISOString(),
        }))
      : [];
    this.roles = Array.isArray(user.roles)
      ? user.roles
      : JSON.parse(user.roles || '[]');
  }
}
