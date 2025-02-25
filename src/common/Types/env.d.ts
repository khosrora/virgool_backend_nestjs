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
    // SECRET
    COOKIE_SECRET: string;
    OTP_TOKEN_SECRET: string;
    ACCESS_TOKEN_SECRET: string;
    REFRESH_TOKEN_SECRET: string;
    EMAIL_TOKEN_SECRET: string;
    PHONE_TOKEN_SECRET: string;
    GOOGLE_Client_ID: string;
    GOOGLE_Client_secret: string;
  }
}
