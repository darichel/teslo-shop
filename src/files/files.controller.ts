import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import type { Response } from 'express';
import { fileFileter, fileNamer } from './helpers';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Get('product/:id')
  findProductImage(@Res() res: Response, @Param('id') id: string) {
    const path = this.filesService.getStaticProductImage(id);
    res.sendFile(path);
  }

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: fileFileter,
      storage: diskStorage({
        destination: './static/products',
        filename: fileNamer,
      }),
    }),
  ) //Interceptor ,'file' must match the field name in the form-data
  uploadProductImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('File not provided');

    const secureUrl = `${file.filename}`;

    return { secureUrl };
  }
}
