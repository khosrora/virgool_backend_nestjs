import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export function TypeormConfig(): TypeOrmModuleOptions {
  const { DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT, DB_USERNAME } = process.env;
  return {
    type: 'postgres',
    port: DB_PORT,
    host: DB_HOST,
    username: DB_USERNAME,
    password: DB_PASSWORD,
    database: DB_NAME,
    synchronize: true,
    autoLoadEntities: false,
    entities: [
      'dist/**/**/**/*.entities{.ts,.js}',
      'dist/**/**/*.entities{.ts,.js}',
    ],
  };
}
