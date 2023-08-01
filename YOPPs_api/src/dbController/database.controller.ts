import { Logger } from '../logger/logger';
import { Options, Sequelize, SyncOptions } from 'sequelize';
import { database } from '../config';
export const dbContext: Sequelize = new Sequelize(database.dbName, database.user, database.password,
  {
      host: database.host,
      port: database.port,
      dialect: 'mysql',
      timezone: database.timezone,
  })
export interface DatabaseOptions {
    database: string,
    username: string,
    password?: string,
    options?: Options
}

export class DatabaseController {

    public dataSource: Sequelize;

    constructor(options: DatabaseOptions | Sequelize) {
        this.dataSource = options instanceof  Sequelize ? options : new Sequelize(options)
    }

    register (options: DatabaseOptions) {
        this.dataSource = new Sequelize(options)
        return this;
    }

    getContext(): Sequelize {
        return this.dataSource;
    }

    async sync(options?:SyncOptions): Promise<void> {
        try {
            await this.dataSource.sync()
        } catch (err) {
            Logger.log(err,'ERROR')
        }
    }

    async connect (): Promise<void> {
        try {
            await this.dataSource.authenticate()
            Logger.log('Database is running')
        } catch (err) {
            Logger.log(err, 'ERROR')
        }
    }
}