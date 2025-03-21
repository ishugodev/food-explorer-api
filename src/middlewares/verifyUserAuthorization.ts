import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';

type UserRole = 'admin' | 'customer' | 'sale';

function verifyUserAuthorization(roleToVerify: UserRole[]) {
  return (request: Request, response: Response, next: NextFunction) => {
    const { user } = request as Request & { user?: { id: number; role: string } };
    const user_role = user?.role as UserRole;

    if (!roleToVerify.includes(user_role)) {
      throw new AppError("Acesso negado.", 401);
    }

    return next();
  }
}

export default verifyUserAuthorization;