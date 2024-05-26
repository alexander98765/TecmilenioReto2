import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './filters/HttpExceptionFilter';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';

/**
   * Main function of nestjs lifecycle
   *
   *@remarks
   * Configure main app module
   * Set prefix to whole api to "Biblioteca"
   * Configure Exception filters
   * Cponfigure global pipes for DTOs validations
   * Configure Swagger tool
*/
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('biblioteca/');
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(new ValidationPipe({ stopAtFirstError: true }));
  app.use(helmet());
  const config = new DocumentBuilder()
    .setTitle('RESTful API for library')
    .setDescription('RESTful API for library. This api allows management of books, authors and user. This api also allows user to login to their account or create a new one. Finally, users can make a reservation of books.')
    .setVersion('1.0')
    .addTag('biblioteca')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(3000);  
}
bootstrap();
