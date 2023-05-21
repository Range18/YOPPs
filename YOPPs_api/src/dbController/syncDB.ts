import {sequelize} from "./dbConnect";
import {force} from "../../config";

export async function syncDB() {
    try {
        if(force){
            await sequelize.sync({force: true})
        }
        else{
            await sequelize.sync()
        }
    } catch (err) {
        console.log(err)
    }
}