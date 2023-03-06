import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const port =
    process.env.PORT == null || process.env.PORT == ''
      ? 3000
      : process.env.PORT;

  const app = await NestFactory.create(AppModule);
  app.enableCors({});

  const config = new DocumentBuilder()
    .setTitle('AWI Quick')
    .setDescription('The AWI Quick description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(port);
}
bootstrap();
