import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/dtos/createUser.dto';
import { LoginUserDto } from 'src/dtos/login-user.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signin')
  @ApiOperation({ summary: 'Iniciar sesión (obtener JWT token)' })
  @ApiResponse({
    status: 200,
    description: 'El usuario se ha autenticado correctamente.',
    schema: {
      example: { accessToken: 'jwt-token' },
    },
  })
  @ApiBadRequestResponse({
    description: 'Email y/o contraseña faltantes o incorrectos.',
  })
  async signin(@Body() loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;
    if (!email || !password) {
      throw new BadRequestException('Email y contraseña son requeridos.');
    }

    const { accessToken } = await this.authService.signin(
      email,
      password.trim(),
    );

    return { accessToken };
  }

  @Post('signup')
  @ApiOperation({ summary: 'Registrar un nuevo usuario' })
  @ApiResponse({
    status: 201,
    description: 'El usuario ha sido registrado exitosamente.',
  })
  @ApiBadRequestResponse({
    description: 'Los datos del usuario no son válidos.',
  })
  async signup(@Body() createUserDto: CreateUserDto) {
    return this.authService.signup(createUserDto);
  }
}
