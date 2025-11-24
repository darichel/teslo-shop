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
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { ConfigService } from '@nestjs/config';
import type { Response } from 'express';
import { fileFileter, fileNamer } from './helpers';
import { FilesService } from './files.service';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService,
    private readonly configService: ConfigService

  ) {}

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

    const secureUrl = `${this.configService.get('HOST_API')}/files/product/${file.filename}`;

    return { secureUrl };
  }
}
