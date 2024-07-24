namespace NodeJS {
  interface ProcessEnv {
    // APPLICATION
    PORT: number;
    // DATABASE
    DB_PORT: number;
    DB_NAME: string;
    DB_USERNAME: string;
    DB_PASSWORD: string;
    DB_HOST: string;
  }
}
