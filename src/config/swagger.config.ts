import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function swaggerConfigInit(app: INestApplication): void {
  const document = new DocumentBuilder()
    .setTitle('Virgool')
    .setDescription('Backend of virgool website')
    .setVersion('1.0')
    .build();

  const swaggerDocument = SwaggerModule.createDocument(app, document);
  SwaggerModule.setup('api', app, swaggerDocument);
}
