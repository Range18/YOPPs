import {NextFunction, Request, Response} from 'express';

/*TODO:
make deep debug mode when res.body is shown
*/
type LogType = 'LOG' | 'INFO' | 'WARN' | 'ERROR'

export class Logger {
    static loggerMiddleware(req: Request, res: Response, next: NextFunction) {
        res.on('finish', () => console.log('\x1b[32m[Server] -', Logger.getDateNow(), '\x1b[38;5;11m[LOG]', `\x1b[38;5;5m${req.method}`, `\x1b[32m${req.url}`, res.statusCode, '\x1b[38;5;15m'))
    }

    static log(message: string, type: LogType = 'INFO', reqLink?: string, resStatus?: number, errors?: any[]) {

        if (reqLink || resStatus) {
            console.log('\x1b[32m[Server] -', Logger.getDateNow(),
                `${Logger.getLogTypeColor(type)}[${type}]`,
                `\x1b[32m${reqLink}`,
                resStatus,
                `\x1b[32m${message}`,
                `${errors}`,
                '\x1b[38;5;15m');
        } else {
            console.log('\x1b[32m[Server] -', Logger.getDateNow(),
                `${Logger.getLogTypeColor(type)}[${type}]`,
                `\x1b[32m${message}`,
                `${errors ?? ''}`,
                '\x1b[38;5;15m');
        }
    }

    private static getDateNow(): string {
        return `\x1b[38;5;140m${new Date(Date.now()).toLocaleString().replace(',', '')}`;
    }

    private static getLogTypeColor(type: LogType) {
        return type == 'LOG' ? '\x1b[38;5;11m' : type == 'INFO' ? '\x1b[36m' : type == 'WARN' ? '\x1b[38;5;209m' : '\x1b[31m';
    }

}

