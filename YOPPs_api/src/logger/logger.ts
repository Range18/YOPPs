import {NextFunction, Request, Response} from 'express';

/*TODO:
make deep debug mode when res.body is shown
*/
type LogType = 'LOG' | 'INFO' | 'WARN' | 'ERROR'

export class Logger {

    constructor(private readonly prefix?: string) {
    }
    loggerMiddleware(req: Request, res: Response, next: NextFunction) {
        res.on('finish', () => console.log('\x1b[32m[Server] -', this.getDateNow(), '\x1b[38;5;11m[LOG]', `\x1b[38;5;5m${req.method}`, `\x1b[32m${req.url}`, res.statusCode, '\x1b[38;5;15m'))
    }

    info(message: string, reqLink?: string, resStatus?: number, errors?: any[]) {
        this.logMessage(message,'INFO', reqLink, resStatus, errors)
    }

    log(message: string, reqLink?: string, resStatus?: number, errors?: any[]) {
        this.logMessage(message,'LOG', reqLink, resStatus, errors)
    }

    warn(message: string, reqLink?: string, resStatus?: number, errors?: any[]) {
        this.logMessage(message,'WARN', reqLink, resStatus, errors)
    }

    error(message: string, reqLink?: string, resStatus?: number, errors?: any[]) {
        this.logMessage(message,'ERROR', reqLink, resStatus, errors)
    }

    private logMessage(message: string, type: LogType, reqLink?: string, resStatus?: number, errors?: any[]){
        if (reqLink || resStatus) {
            console.log('\x1b[32m[Server] -', this.getDateNow(),
                `${this.getLogTypeColor(type)}[${type}]`,
                `\x1b[32m${reqLink}`,
                resStatus,
                `\x1b[32m${message}`,
                `${errors}`,
                '\x1b[38;5;15m');
        } else {
            console.log('\x1b[32m[Server] -', this.getDateNow(),
                `${this.getLogTypeColor(type)}[${type}]`,
                `\x1b[32m${message}`,
                `${errors ?? ''}`,
                '\x1b[38;5;15m');
        }
    }

    private getDateNow(): string {
        return `\x1b[38;5;140m${new Date(Date.now()).toLocaleString().replace(',', '')}`;
    }

    private getLogTypeColor(type: LogType) {
        return type == 'LOG' ? '\x1b[38;5;11m' : type == 'INFO' ? '\x1b[36m' : type == 'WARN' ? '\x1b[38;5;209m' : '\x1b[31m';
    }

}

