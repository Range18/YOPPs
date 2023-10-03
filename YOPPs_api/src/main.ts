import { apiServer, clientServer, database } from './config';
import authRoute from './auth/auth.route';
import { errorMiddleware } from './middlewares/errorMiddleware';
import userRouter from './page/userPageRoute';
import StorageService from './storage/storage.service';
import { Logger } from './logger/logger';
import {
  DatabaseController,
  dbContext,
} from './dbController/database.controller';
import multer from 'multer';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import Express from 'express';

export const dataSource = new DatabaseController(dbContext);
export const app = Express();
export const logger = new Logger('HTTP');
const bootstrap = async () => {
  try {
    logger.info('Prepare server start...');

    app.use(Express.json());
    app.use(Express.urlencoded({ extended: true }));
    app.use(
      multer({
        storage: StorageService.storageConfig,
        fileFilter: StorageService.fileFilter,
      }).single('file'),
    );

    app.use(
      cors({
        credentials: true,
        origin: clientServer.url,
      }),
    );
    app.use(cookieParser());

    app.use('/auth', authRoute);
    app.use('/profile', userRouter);

    app.use(errorMiddleware);
    app.use(logger.loggerMiddleware);

    await dataSource.connect();
    await dataSource.sync({ force: database.dropDB });

    app.listen(apiServer.port, () =>
      logger.info(
        `Server is started at http://${apiServer.host}:${apiServer.port}`,
      ),
    );
  } catch (err) {
    console.log(err);
  }
};

bootstrap();
