import Express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import multer from 'multer';

import { apiServer, clientServer, database } from './config';
import authRoute from './routes/authRoute';
import { errorMiddleware } from './middlewares/errorMiddleware';
import userRouter from './routes/userPageRoute';
import StorageService from './services/storageService';
import { Logger } from './logger/logger';
import { DatabaseController, dbContext } from './dbController/database.controller';

export const dataSource = new DatabaseController(dbContext)
export const app = Express();
const bootstrap = async () => {
    try {
        Logger.log('Prepare server start...', 'INFO');

        app.use(Express.json());
        app.use(Express.urlencoded({ extended: true }));
        app.use(multer({ storage: StorageService.storageConfig, fileFilter: StorageService.fileFilter }).single('file'));
        app.use(cors({
            credentials: true,
            origin: clientServer.url,
        }));
        app.use(cookieParser());

        app.use('/auth', authRoute);
        app.use('/userPage', userRouter);

        app.use(errorMiddleware);
        app.use(Logger.loggerMiddleware)

        await dataSource.connect()
        await dataSource.sync({force: database.dropDB})

        app.listen(apiServer.port, () => Logger.log(`Server is started at http://${apiServer.host}:${apiServer.port}`, 'INFO'));

    } catch (err) {
        console.log(err);
    }
};

bootstrap();