import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { SecuritySchemeObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';

export function swaggerConfigInit(app: INestApplication): void {
  const document = new DocumentBuilder()
    .setTitle('Virgool')
    .setDescription('Backend of virgool website')
    .setVersion('1.0')
    .addBearerAuth(swaggerAuthConfig(), 'Authorization')
    .build();

  const swaggerDocument = SwaggerModule.createDocument(app, document);
  SwaggerModule.setup('api', app, swaggerDocument);
}

export function swaggerAuthConfig(): SecuritySchemeObject {
  return {
    type: 'http',
    bearerFormat: 'JWT',
    in: 'header',
    scheme: 'bearer',
  };
}
