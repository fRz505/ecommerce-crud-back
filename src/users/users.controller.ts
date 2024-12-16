import {
  Controller,
  Get,
  Body,
  Param,
  Put,
  Delete,
  Query,
  UseGuards,
  NotFoundException,
  InternalServerErrorException,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { AuthGuard } from '../auth/auth.guard';
import { RoleGuard } from '../auth/role.guard';
import { UpdateUserDto, UserResponseDto } from '../dtos/user.dto';
import { Roles } from 'src/auth/roles.decorator';

@ApiTags('Users')
@Controller('users')
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(AuthGuard, RoleGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Obtener todos los usuarios' })
  @ApiResponse({
    status: 200,
    description: 'Lista de usuarios obtenida correctamente',
    type: [UserResponseDto],
  })
  @ApiResponse({ status: 500, description: 'Error al obtener los usuarios' })
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
  ): Promise<UserResponseDto[]> {
    try {
      const users = await this.usersService.findAll(page, limit);
      return users;
    } catch {
      throw new InternalServerErrorException('Error retrieving users');
    }
  }

  @Get(':id')
  @UseGuards(AuthGuard, RoleGuard)
  @ApiOperation({ summary: 'Obtener un usuario por ID' })
  @ApiResponse({
    status: 200,
    description: 'Usuario obtenido correctamente',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Formato UUID no válido' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  @ApiResponse({ status: 500, description: 'Error al obtener el usuario' })
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<UserResponseDto> {
    try {
      const user = await this.usersService.findOne(id);
      if (!user) {
        throw new NotFoundException('User not found');
      }
      return user;
    } catch {
      throw new InternalServerErrorException('Error retrieving user');
    }
  }

  @Put(':id')
  @UseGuards(AuthGuard, RoleGuard)
  @ApiOperation({ summary: 'Actualizar un usuario existente' })
  @ApiResponse({
    status: 200,
    description: 'Usuario actualizado correctamente',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Formato UUID no válido' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  @ApiResponse({ status: 500, description: 'Error al actualizar el usuario' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    try {
      const user = await this.usersService.update(id, updateUserDto);
      if (!user) {
        throw new NotFoundException('Usuario no encontrado');
      }
      return user;
    } catch {
      throw new InternalServerErrorException('Error al actualizar el usuario');
    }
  }

  @Delete(':id')
  @UseGuards(AuthGuard, RoleGuard)
  @ApiOperation({ summary: 'Eliminar un usuario' })
  @ApiResponse({
    status: 200,
    description: 'Usuario eliminado correctamente',
    schema: {
      example: { message: 'Usuario eliminado con exito' },
    },
  })
  @ApiResponse({ status: 400, description: 'Formato UUID no válido' })
  @ApiResponse({ status: 500, description: 'Error al eliminar el usuario' })
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<{ message: string }> {
    try {
      await this.usersService.remove(id);
      return { message: 'Usuario eliminado con exito' };
    } catch {
      throw new InternalServerErrorException('Error al eliminar el usuario');
    }
  }
}
