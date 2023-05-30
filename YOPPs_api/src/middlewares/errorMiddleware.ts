import { ApiError } from '../Errors/ApiErrors';
import { NextFunction, Request, Response } from 'express';

export const errorMiddleware = function(err: ApiError | any, req: Request, res: Response, next: NextFunction) {
  console.log(err);
  if (err instanceof ApiError) return res.status(err.status).json({ message: err.message, errors: err.errors });
  return res.status(500).json({ message: 'Unexpected Error' });
};