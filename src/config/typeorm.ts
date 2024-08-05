import { config } from 'dotenv';
import { join } from 'path';
import { DataSource } from 'typeorm';

config();
config({ path: join(process.cwd(), '.env') });

const { DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT, DB_USERNAME } = process.env;

let dataSource = new DataSource({
  type: 'postgres',
  port: +DB_PORT,
  host: DB_HOST,
  password: DB_PASSWORD,
  username: DB_USERNAME,
  database: DB_NAME,
  synchronize: false,
  entities: [
    'dist/**/**/**/*.entities{.ts,.js}',
    'dist/**/**/*.entities{.ts,.js}',
  ],
  migrations: ['dist/migrations/*{*.ts,*.js}'],
  migrationsTableName: 'virgool_migration_db',
});

export default dataSource;
