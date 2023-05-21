

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

export const apiServer: IApiServer = {
    port: 8000,
    host: 'localhost',
    url: `http://localhost:8000/api`
}

export const clientServer: IClientServer = {
    port: 3000,
    host: 'localhost',
    url: `http://localhost:5000`
}