import { Injectable } from '@nestjs/common';
import { FileRepository } from './file.repository';
import { UploadApiResponse, v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';
import { CloudinaryConfig } from 'src/config/cloudinary';
import { ProductsRepository } from 'src/products/products.repository';

@Injectable()
export class FileService {
  constructor(
    private readonly fileRepository: FileRepository,
    private readonly productsRepository: ProductsRepository,
  ) {
    CloudinaryConfig.useFactory();
  }

  async uploadImageToCloudinary(
    productId: string,
    file: Express.Multer.File,
  ): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const upload = cloudinary.uploader.upload_stream(
        { resource_type: 'auto' },
        async (error, result) => {
          if (error) {
            reject(error);
          } else {
            await this.productsRepository.updateImage(
              productId,
              result.secure_url,
            );
            this.fileRepository.saveFile({
              productId,
              file,
              cloudinaryResult: result,
            });
            resolve(result);
          }
        },
      );

      if (file && file.buffer) {
        Readable.from(file.buffer).pipe(upload);
      } else {
        reject(new Error('No file buffer found'));
      }
    });
  }
}
