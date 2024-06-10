import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //Open API (Swagger)
  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle(process.env.APP_NAME)
    .setDescription(`Last Updated: ${process.env.APP_BUILD_DATE}`)
    .setVersion(process.env.APP_VERSION)
    .addTag('Auth')
    .addTag('User')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('', app, document);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );

  app.enableCors();

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
