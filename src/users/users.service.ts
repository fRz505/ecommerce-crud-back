import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { CreateUserDto, UpdateUserDto } from '../dtos/user.dto';
import { UserResponseDto } from '../dtos/user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    try {
      const newUser = await this.usersRepository.create({
        ...createUserDto,
        roles: ['user'],
      } as CreateUserDto & { roles: string[] });

      return new UserResponseDto(newUser);
    } catch {
      throw new BadRequestException('Invalid user data');
    }
  }

  async findAll(page: number, limit: number): Promise<UserResponseDto[]> {
    try {
      const users = await this.usersRepository.findAll(page, limit);
      return users.map((user) => new UserResponseDto(user));
    } catch (error) {
      console.error('Error al recuperar los usuarios:', error);
      throw new Error('Error retrieving users');
    }
  }
  async findOne(id: string): Promise<UserResponseDto | undefined> {
    try {
      const user = await this.usersRepository.findOne(id);
      if (!user) {
        throw new NotFoundException('User not found');
      }
      return new UserResponseDto(user);
    } catch {
      throw new Error('Error retrieving user');
    }
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto | undefined> {
    try {
      const user = await this.usersRepository.update(id, updateUserDto);
      if (!user) {
        throw new NotFoundException('User not found');
      }
      return new UserResponseDto(user);
    } catch {
      throw new Error('Error updating user');
    }
  }

  async remove(id: string): Promise<void> {
    try {
      await this.usersRepository.remove(id);
    } catch {
      throw new Error('Error deleting user');
    }
  }
}
