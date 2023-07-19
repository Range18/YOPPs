import { ApiError } from '../Errors/ApiErrors';
import { AuthExceptions } from '../Errors/HttpExceptionsMessages';
import { NextFunction, Request, Response } from 'express';
import {User} from "../Dto/User";

export async function activatedMiddleware(req: Request, res: Response, next: NextFunction) {
    try {
        const userData: User = req['user']
        if (!userData.isActivated) return next(ApiError.Forbidden((AuthExceptions.NotActivated)));
        next();
    } catch (err) {
        return next(ApiError.UnauthorizedError());
    }
}