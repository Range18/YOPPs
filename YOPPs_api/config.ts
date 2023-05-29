import * as dotenv from 'dotenv'

dotenv.config()

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

export const apiServer: IApiServer = {
    port: parseInt(process.env.API_PORT as string),
    host: process.env.API_HOST as string,
    url: `http://localhost:8000`
}
export const bcryptSalt: number = 10
export const force: boolean = true
export const clientServer: IClientServer = {
    port: parseInt(process.env.CLIENT_PORT as string),
    host: process.env.CLIENT_HOST as string,
    url: `http://localhost:3000`
}

export const database: IDatabase = {
    port: parseInt(process.env.DATABASE_PORT as string),
    host: process.env.DATABASE_HOST as string,
    user: process.env.DATABASE_USER as string,
    password: process.env.DATABASE_PASSWORD as string,
    dbName: process.env.DATABASE_NAME as string,
    timezone: process.env.DATABASE_TIMEZONE as string,
}

export const storagePath: string = process.env.STORAGE_PATH as string


export const jwtSettings: IJwtSettings = {
    secret: process.env.JWT_SECRET as string,
    authExpires: {
        refresh: process.env.REFRESH_EXPIRE as string,
        access: process.env.ACCESS_EXPIRE as string
    },
}


export const smtpServer: ISmtpServer = {
    agent: process.env.SMTP_AGENT as string,
    port: parseInt(process.env.SMTP_PORT as string),
    host: process.env.SMTP_HOST as string,
    user: process.env.SMTP_USER as string,
    password: process.env.SMTP_PASSWORD as string,
}