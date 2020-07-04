import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import authConfig from '@config/auth';

import RequestError from '@shared/errors/RequestError';

interface ITokenPayload {
  iat: number;
  exp: number;
  sub: string;
}

export default function ensureAuthenticatedUser(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    throw new RequestError('JWT token is missing', 401);
  }

  // Bearer asdasdasdasdas
  const [, token] = authHeader.split(' ');

  const decoded = verify(token, authConfig.jwt.token) as ITokenPayload;
  req.user = {
    id: decoded.sub,
  };
  return next();
}
