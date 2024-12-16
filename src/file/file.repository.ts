import { Injectable } from '@nestjs/common';

@Injectable()
export class FileRepository {
  private readonly files: any[] = [];

  saveFile(fileData: any): any {
    this.files.push(fileData);
    return fileData;
  }

  getFiles(): any[] {
    return this.files;
  }
}
