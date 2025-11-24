import { BadRequestException } from '@nestjs/common';

export const fileFileter = (
  req: Express.Request,
  file: Express.Multer.File,
  callback: Function,
) => {
  if (!file) return callback(new BadRequestException('File is empty'), false);

  const fileExtension = file.mimetype.split('/')[1];
  const validExtensions = ['jpg', 'jpeg', 'png', 'gif'];


  if (!validExtensions.includes(fileExtension))
    return callback(new BadRequestException('Invalid file type'), false);

  callback(null, true);
};
