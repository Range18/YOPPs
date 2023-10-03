import { Color } from './color.type';
import { Request, Response } from 'express';

type LogType = 'LOG' | 'INFO' | 'WARN' | 'ERROR';

//TODO add prefixes (in loggerMiddleware)

export class Logger {
  constructor(private readonly prefix?: string) {}

  public loggerMiddleware(req: Request, res: Response) {
    res.on('finish', function () {
      console.log(
        `${Logger.getColor('green')}[Server] -`,
        Logger.getDateNow(),
        `${Logger.getColor('gold')}[LOG]`,
        `${Logger.getColor('purple')}${req.method}`,
        `${Logger.getColor('green')}${req.url}`,
        res.statusCode,
        Logger.getColor('white'),
      );
    });
  }

  info(message: string, reqLink?: string, resStatus?: number, errors?: any[]) {
    this.logMessage(message, 'INFO', reqLink, resStatus, errors);
  }

  log(message: string, reqLink?: string, resStatus?: number, errors?: any[]) {
    this.logMessage(message, 'LOG', reqLink, resStatus, errors);
  }

  warn(message: string, reqLink?: string, resStatus?: number, errors?: any[]) {
    this.logMessage(message, 'WARN', reqLink, resStatus, errors);
  }

  error(message: string, reqLink?: string, resStatus?: number, errors?: any[]) {
    this.logMessage(message, 'ERROR', reqLink, resStatus, errors);
  }

  private logMessage(
    message: string,
    type: LogType,
    reqLink?: string,
    resStatus?: number,
    errors?: any[],
  ) {
    if (reqLink || resStatus) {
      console.log(
        `${Logger.getColor('green')}[Server] -`,
        Logger.getDateNow(),
        `${this.getLogTypeColor(type)}[${type}]`,
        `${Logger.getColor('green')}${reqLink}`,
        resStatus,
        `${Logger.getColor('green')}${message}`,
        `${errors}`,
        Logger.getColor('white'),
      );
    } else {
      console.log(
        `${Logger.getColor('green')}[Server] -`,
        Logger.getDateNow(),
        `${this.getLogTypeColor(type)}[${type}]`,
        `${Logger.getColor('green')}${message}`,
        `${errors ?? ''}`,
        Logger.getColor('white'),
      );
    }
  }

  private static getDateNow(): string {
    return `${Logger.getColor('purple')}${new Date(Date.now())
      .toLocaleString()
      .replace(',', '')}`;
  }

  private getLogTypeColor(type: LogType) {
    return type == 'LOG'
      ? Logger.getColor('gold')
      : type == 'INFO'
      ? Logger.getColor('cyan')
      : type == 'WARN'
      ? Logger.getColor('orange')
      : Logger.getColor('red');
  }

  private static getColor(color: keyof typeof Color): string {
    switch (color) {
      case 'green':
        return '\x1b[32m';
      case 'red':
        return '\x1b[31m';
      case 'purple':
        return '\x1b[38;5;140m';
      case 'gold':
        return '\x1b[38;5;11m';
      case 'orange':
        return "\x1b[38;5;209m'";
      case 'cyan':
        return '\x1b[36m';

      case 'white':
      default:
        return '\x1b[38;5;15m';
    }
  }
}
