import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { FileService } from './file.service';
import { FileController } from './file.controller';
import { FileRepository } from './file.repository';
import { ProductsModule } from '../products/products.module';
import * as multer from 'multer';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MulterModule.register({
      storage: multer.memoryStorage(),
    }),
    ProductsModule,
    AuthModule,
  ],
  providers: [FileService, FileRepository],
  controllers: [FileController],
})
export class FileModule {}
