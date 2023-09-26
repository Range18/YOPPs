import { ApiError } from '../Errors/ApiErrors';
import { logger } from '../main';
import { Request, Response } from 'express';

export const errorMiddleware = function (
  err: ApiError | unknown,
  req: Request,
  res: Response,
) {
  if (err instanceof ApiError) {
    logger.error(err.message, req.url, err.status ?? 500, err.errors);
    return res
      .status(err.status)
      .json({ message: err.message, errors: err.errors });
  } else {
    console.log(err);
  }

  return res.status(500).json({ message: 'Unexpected Error' });
};
