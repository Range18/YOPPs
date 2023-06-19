import {dbContext} from "./dbConnect";
import { dropDatabaseDev } from '../../config';
import { Logger } from '../logger/logger';

export async function syncDB() {
    try {
        if(dropDatabaseDev){
            await dbContext.sync({force: true})
            Logger.log('Database is dropped')
        }
        else{
            await dbContext.sync()
            Logger.log('Database is synchronized')
        }
    } catch (err) {
        console.log(err)
    }
}