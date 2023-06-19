import Express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import multer from 'multer';

import { apiServer, clientServer } from '../config';
import { connectDB } from './dbController/dbConnect';
import { syncDB } from './dbController/syncDB';
import authRoute from './routes/authRoute';
import { errorMiddleware } from './middlewares/errorMiddleware';
import userRouter from './routes/userPageRoute';
import StorageService from './services/storageService';
import { Logger } from './logger/logger';


export const app = Express();

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
const startApp = async () => {
    try {
        Logger.log('Prepare server start...', 'INFO')
        await connectDB();
        await syncDB();
        app.listen(apiServer.port, () => Logger.log(`Server is started at http://${apiServer.host}:${apiServer.port}`, 'INFO'));
    } catch (err) {
        console.log(err);
    }
};

startApp();