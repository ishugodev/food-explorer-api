import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import { AppError } from '../utils/AppError';
import authConfig from '../config/auth';

type UserRole = 'admin' | 'customer' | 'sale';

interface JWTPayload {
  role: string;
  sub: string;
}

export function ensureAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction
): void {
  const token = request.cookies.token;

  if (!token) {
    throw new AppError("JWT Token não informado.", 401);
  }

  try {
    const { role, sub: user_id } = verify(token, authConfig.jwt.secret) as JWTPayload;

    (request as Request & { user: { id: number; role: UserRole } }).user = {
      id: Number(user_id),
      role: role as UserRole
    };

    return next();
  } catch {
    throw new AppError("JWT Token inválido.", 401);
  }
}