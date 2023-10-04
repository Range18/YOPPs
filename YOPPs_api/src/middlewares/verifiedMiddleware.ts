import { ApiError } from '../Errors/ApiErrors';
import { AuthExceptions } from '../Errors/HttpExceptionsMessages';
import { UserIntercepted } from '../user/types/user-intercepted';
import { UserPayload } from '../user/types/user-payload';
import { NextFunction, Request, Response } from 'express';

export async function VerifiedMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const userData: UserIntercepted = req['user'];

    if (!userData.isActivated)
      return next(new ApiError(403, AuthExceptions.NotActivated));

    next();
  } catch (err) {
    return next(
      new ApiError(
        400,
        `Something went wrong in middleware with error: ${err}`,
      ),
    );
  }
}
