import {Sequelize} from "sequelize";
import {database} from "../../config";


export const dbContext = new Sequelize(database.dbName,database.user,database.password, {
    port: database.port,
    host: database.host,
    dialect: 'mysql',
    timezone: database.timezone,
})

export async function connectDB() {
    try {
        await dbContext.authenticate()
    } catch (err) {
        console.log(err)
    }
}