import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { swaggerConfigInit } from './config/swagger.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  swaggerConfigInit(app);
  await app.listen(3000);
}
bootstrap();
