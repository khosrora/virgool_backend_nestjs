import { UserEntity } from 'src/modules/user/entities/user.entities';

declare global {
  namespace Express {
    interface Request {
      user?: UserEntity;
    }
  }
}

declare module 'express-serve-static-core' {
  interface Request {
    user?: UserEntity;
  }
}
