import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { UsersRepository } from './users.repository';
import { BadRequestException } from '@nestjs/common';
import { CreateUserDto, UserResponseDto } from '../dtos/user.dto';
import { User } from '../entities/user.entity';

describe('UsersService', () => {
  let service: UsersService;

  const mockUserRepository = {
    create: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: UsersRepository, useValue: mockUserRepository },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('debe ser definido', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('debería crear un nuevo usuario exitosamente', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        name: 'John Doe',
        password: 'password123',
        address: '123 Main St',
        phone: '1234567890',
        country: 'Country',
        city: 'City',
      };

      const user: User = {
        id: '1',
        ...createUserDto,
        orders: [],
        roles: ['user'],
      };

      mockUserRepository.create.mockReturnValue(user);
      mockUserRepository.save.mockResolvedValue(user);

      const result = await service.create(createUserDto);

      expect(result).toBeInstanceOf(UserResponseDto);
      expect(result.id).toEqual(user.id);
      expect(result.name).toEqual(user.name);
    });

    it('debe lanzar BadRequestException en caso de error en la creacion', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        name: 'John Doe',
        password: 'password123',
        address: '123 Main St',
        phone: '1234567890',
        country: 'Country',
        city: 'City',
      };

      mockUserRepository.create.mockImplementation(() => {
        throw new Error();
      });

      await expect(service.create(createUserDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
