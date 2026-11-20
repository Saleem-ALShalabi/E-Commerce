import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  // Every route starts with /api  (e.g. GET /api/categories)
  app.setGlobalPrefix('api');

  // Allow the Next.js app to call this API from the browser.
  app.enableCors({ origin: config.get<string>('WEB_ORIGIN', 'http://localhost:3000') });

  // Validate every request body / query against its DTO class.
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // strip properties that are not in the DTO
      forbidNonWhitelisted: true, // ...and return 400 if the client sends them
      transform: true, // turn query strings like "?page=2" into numbers
    }),
  );

  // Interactive API docs at http://localhost:3001/api/docs
  const swaggerConfig = new DocumentBuilder()
    .setTitle('E-Commerce API')
    .setDescription('REST API for the E-Commerce project')
    .setVersion('0.1.0')
    .addBearerAuth()
    .build();
  SwaggerModule.setup('api/docs', app, () => SwaggerModule.createDocument(app, swaggerConfig));

  const port = config.get<number>('PORT', 3001);
  await app.listen(port);
  console.log(`API running on http://localhost:${port}/api  (docs: /api/docs)`);
}
await bootstrap();
