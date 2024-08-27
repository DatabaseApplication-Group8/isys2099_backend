import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Config Service
  const configService = app.get(ConfigService)

  // CORS
  app.enableCors()

  // 
  app.use(express.static("."))

  const config = new DocumentBuilder()
    .setTitle('ISYS2099 - GROUP 8 - DATABASE PROJECT')
    .setDescription('API Documentation for Hospital Management System. Please follow the instructions for each API below.')
    .setVersion('1.0')
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

  await app.listen(8080);
}
bootstrap();
