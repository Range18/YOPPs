import { ApiError } from '../Errors/ApiErrors';
import TokenService from '../services/tokenService';
import { UserDto } from '../Dto/UserDto';
import { AuthExceptions, TokenExceptions } from '../Errors/HttpExceptionsMessages';
import { NextFunction, Request, Response } from 'express';

export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
    try {
        const accessToken = req.headers.authorization.split(' ')[1];
        if (!accessToken) return next(ApiError.UnauthorizedError(TokenExceptions.InvalidToken));
        const userData: UserDto | null = TokenService.validateToken(accessToken);
        if (!userData) return next(ApiError.UnauthorizedError());
        req['user'] = userData;
        next();
    } catch (err) {
        return next(ApiError.UnauthorizedError());
    }
}