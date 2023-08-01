import * as dotenv from 'dotenv';
import { BOOLEAN } from 'sequelize';

dotenv.config();

interface IApiServer {
    port: number;
    host: string;
    url: string;
}

interface IClientServer {
    port: number;
    host: string;
    url: string;
}

interface IDatabase {
    port: number;
    host: string;
    user: string;
    password: string;
    dbName: string;
    timezone: string;
    dropDB: boolean;
}

interface IJwtSettings {
    secret: string;
    authExpires: IAuthExpires;
}

interface IAuthExpires {
    refresh: string;
    access: string;
}

interface ISmtpServer {
    agent: string;
    port: number;
    host: string;
    user: string;
    password: string;
}

interface IStorageSettings {
    destination: string;
    allowedExtensions: Map<string, string>;
    defaultAvatar: string;
    maxFileSize: number;
}

export const apiServer: Readonly<IApiServer> = {
    port: parseInt(process.env.API_PORT as string),
    host: process.env.API_HOST as string,
    url: `http://localhost:8000`,
};
export const bcryptSalt: number = 10;
export const dropDatabaseDev: boolean = false;
export const clientServer: Readonly<IClientServer> = {
    port: parseInt(process.env.CLIENT_PORT as string),
    host: process.env.CLIENT_HOST as string,
    url: `http://localhost:3000`,
};

export const database: Readonly<IDatabase> = {
    port: parseInt(process.env.DATABASE_PORT as string),
    host: process.env.DATABASE_HOST as string,
    user: process.env.DATABASE_USER as string,
    password: process.env.DATABASE_PASSWORD as string,
    dbName: process.env.DATABASE_NAME as string,
    timezone: process.env.DATABASE_TIMEZONE as string,
    dropDB: Boolean(process.env.DROP_DB) as boolean,
};
export const storageSettings: Readonly<IStorageSettings> = {
    destination: process.env.STORAGE_PATH as string,
    allowedExtensions: new Map()
      .set('image/jpeg', 'FFD8')
      .set('image/png', '89504E470D0A1A0A')
      .set('image/jpg', '474946')
      .set('image/gif', '474946'),
    defaultAvatar: 'default.png',
    maxFileSize: 8196 * 1024,
};


export const jwtSettings: Readonly<IJwtSettings> = {
    secret: process.env.JWT_SECRET as string,
    authExpires: {
        refresh: process.env.REFRESH_EXPIRE as string,
        access: process.env.ACCESS_EXPIRE as string,
    },
};

export const PWDCodeExpireIn: string = '24h';

export const smtpServer: Readonly<ISmtpServer> = {
    agent: process.env.SMTP_AGENT as string,
    port: parseInt(process.env.SMTP_PORT as string),
    host: process.env.SMTP_HOST as string,
    user: process.env.SMTP_USER as string,
    password: process.env.SMTP_PASSWORD as string,
};