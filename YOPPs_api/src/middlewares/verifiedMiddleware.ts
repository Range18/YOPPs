import { ApiError } from '../Errors/ApiErrors';
import { AuthExceptions } from '../Errors/HttpExceptionsMessages';
import { User } from '../Dto/User';
import { NextFunction, Request, Response } from 'express';

export async function VerifiedMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const userData: User = req['user'];

    if (!userData.isActivated)
      return next(new ApiError(403, AuthExceptions.NotActivated));

    next();
  } catch (err) {
    return next(new ApiError(404, AuthExceptions.UserIsUnauthorized));
  }
}
