import { ApiError } from '../Errors/ApiErrors';
import { NextFunction, Request, Response } from 'express';
import {logger} from "../index";

export const errorMiddleware = function(err: ApiError | any, req: Request, res: Response, next: NextFunction) {
    console.log(err);

    logger.error(err.message, req.url , err.status ?? 500,  err.errors)

    if (err instanceof ApiError) return res.status(err.status).json({ message: err.message, errors: err.errors });

    return res.status(500).json({ message: 'Unexpected Error' });
};