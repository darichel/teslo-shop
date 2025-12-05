import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger, ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  console.log('Environment variables:');
  console.log('DB_HOST:', process.env.DB_HOST);
  console.log('DB_PORT:', process.env.DB_PORT);
  console.log('POSTGRES_USER:', process.env.POSTGRES_USER);
  console.log('POSTGRES_DB:', process.env.POSTGRES_DB);
  console.log('STAGE:', process.env.STAGE);

  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');
  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
  );

  const config = new DocumentBuilder()
    .setTitle('Teslo RESTFul API')
    .setDescription('The Teslo API description')
    .setVersion('1.0')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/v1', app, documentFactory);

  await app.listen(process.env.PORT || 3000);
  logger.log(`Application is running on: ${process.env.PORT || 3000}`);
}
bootstrap();
