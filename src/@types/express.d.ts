type UserRole = 'admin' | 'customer' | 'sale';

import { Request as ExpressRequest } from 'express';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        role: UserRole;
      };
      file?: express.Multer.File;
    }
  }
}

export {};