import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { CreateUserDto, UpdateUserDto } from 'src/dtos/user.dto';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll(page: number, limit: number): Promise<User[]> {
    return this.userRepository.find({
      skip: (page - 1) * limit,
      take: limit,
      relations: ['orders'],
    });
  }

  async findOne(id: string): Promise<User | undefined> {
    return this.userRepository.findOne({
      where: { id },
      relations: ['orders'],
    });
  }

  async findOneByEmail(email: string): Promise<User | undefined> {
    return this.userRepository.findOne({
      where: { email },
      relations: ['orders'],
    });
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const newUser = this.userRepository.create({
      ...createUserDto,
      orders: [],
    });

    return this.userRepository.save(newUser);
  }

  async update(
    id: string,
    updatedUser: UpdateUserDto,
  ): Promise<User | undefined> {
    const user = await this.userRepository.preload({
      id,
      ...updatedUser,
    });
    if (user) {
      return this.userRepository.save(user);
    }
    return undefined;
  }

  async remove(id: string): Promise<void> {
    await this.userRepository.delete(id);
  }
}
