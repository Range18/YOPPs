import { ApiError } from '../Errors/ApiErrors';
import { NextFunction, Request, Response } from 'express';
import { Logger } from '../logger/logger';

export const errorMiddleware = function(err: ApiError | any, req: Request, res: Response, next: NextFunction) {
    console.log(err);

    Logger.log(err.message, 'ERROR', req.url , err.status ?? 500,  err.errors)

    if (err instanceof ApiError) return res.status(err.status).json({ message: err.message, errors: err.errors });

    return res.status(500).json({ message: 'Unexpected Error' });
};