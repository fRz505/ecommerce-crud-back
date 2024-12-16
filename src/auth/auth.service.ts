import { Injectable, BadRequestException } from '@nestjs/common';
import { UsersRepository } from '../users/users.repository';
import { User } from '../entities/user.entity';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../dtos/createUser.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly jwtService: JwtService,
  ) {}

  async signin(
    email: string,
    password: string,
  ): Promise<{ accessToken: string }> {
    email = email.trim();
    password = password.trim();

    if (!email || !password) {
      throw new BadRequestException('Email y contraseña son requeridos');
    }

    const user = await this.usersRepository.findOneByEmail(email);

    if (!user) {
      throw new BadRequestException('Usuario inexistente');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new BadRequestException('Email o password incorrectos');
    }

    const payload = {
      email: user.email,
      sub: user.id,
      roles: user.roles,
    };
    const accessToken = this.jwtService.sign(payload);

    return { accessToken };
  }

  async signup(createUserDto: CreateUserDto): Promise<User> {
    const { password, email } = createUserDto;

    const userExists = await this.usersRepository.findOneByEmail(email);
    if (userExists) {
      throw new BadRequestException('El correo electrónico ya está en uso');
    }

    const hashedPassword = await bcrypt.hash(password.trim(), 12);

    createUserDto.password = hashedPassword;

    return this.usersRepository.create(createUserDto);
  }
}
