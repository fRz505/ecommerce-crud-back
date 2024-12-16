import {
  Controller,
  Post,
  UploadedFile,
  Param,
  UseInterceptors,
  BadRequestException,
  InternalServerErrorException,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileService } from './file.service';
import { extname } from 'path';
import { AuthGuard } from 'src/auth/auth.guard';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Files')
@Controller('files')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post('/uploadImage/:id')
  @UseGuards(AuthGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: (req, file, callback) => {
        const allowedFileTypes = /jpg|jpeg|png/;
        const extnameCheck = allowedFileTypes.test(
          extname(file.originalname).toLowerCase(),
        );
        const mimetypeCheck = allowedFileTypes.test(file.mimetype);

        if (extnameCheck && mimetypeCheck) {
          return callback(null, true);
        } else {
          return callback(
            new BadRequestException(
              'Tipo de archivo no válido. Solo se permiten archivos .jpg, .jpeg y .png',
            ),
            false,
          );
        }
      },
      limits: { fileSize: 200 * 1024 },
    }),
  )
  @ApiOperation({
    summary: 'Subir una imagen para un producto',
    description: 'Permite subir una imagen para un producto específico',
  })
  @ApiResponse({
    status: 200,
    description: 'Imagen subida correctamente',
  })
  @ApiResponse({
    status: 400,
    description:
      'Tipo de archivo no válido. Solo se permiten .jpg, .jpeg, y .png',
  })
  @ApiResponse({
    status: 404,
    description: 'Producto no encontrado',
  })
  @ApiResponse({
    status: 500,
    description: 'Error al subir la imagen',
  })
  async uploadImage(
    @Param('id') productId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    try {
      if (!file) {
        throw new BadRequestException('No se ha subido ningún archivo');
      }
      return await this.fileService.uploadImageToCloudinary(productId, file);
    } catch (error) {
      console.error('Error al subir la imagen:', error);
      throw new InternalServerErrorException('Error al subir la imagen', error);
    }
  }
}
