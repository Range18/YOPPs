import { ApiError } from '../Errors/ApiErrors';
import { AuthExceptions } from '../Errors/HttpExceptionsMessages';
import { NextFunction, Request, Response } from 'express';

export async function activatedMiddleware(req: Request, res: Response, next: NextFunction) {
    try {
        const userData = req['user']
        if (!userData.isActivated) return next(ApiError.Forbidden((AuthExceptions.NotActivated)));
        next();
    } catch (err) {
        return next(ApiError.UnauthorizedError());
    }
}