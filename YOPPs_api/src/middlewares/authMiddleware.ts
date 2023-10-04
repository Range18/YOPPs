import { ApiError } from '../Errors/ApiErrors';
import TokenService from '../session/token.service';
import { UserPayload } from '../user/types/user-payload';
import { TokenExceptions } from '../Errors/HttpExceptionsMessages';
import { UserModel } from '../user/User-model';
import { type UserIntercepted } from '../user/types/user-intercepted';
import { NextFunction, Request, Response } from 'express';

export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const accessToken = req.headers.authorization?.split(' ')[1];

    if (!accessToken)
      return next(ApiError.UnauthorizedError(TokenExceptions.InvalidToken));

    const userData: UserPayload | null = TokenService.validate(accessToken);

    if (!userData) return next(ApiError.UnauthorizedError());

    const user = await UserModel.findOne({ where: { UUID: userData.UUID } });

    if (!user) return next(ApiError.UnauthorizedError());

    req['user'] = {
      UUID: user.UUID,
      username: user.username,
      email: user.email,
      isActivated: user.isActivated,
    } as UserIntercepted;

    next();
  } catch (err) {
    return next(ApiError.UnauthorizedError());
  }
}
