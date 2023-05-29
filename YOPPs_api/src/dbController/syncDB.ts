import {dbContext} from "./dbConnect";
import {force} from "../../config";

export async function syncDB() {
    try {
        if(force){
            await dbContext.sync({force: true})
        }
        else{
            await dbContext.sync()
        }
    } catch (err) {
        console.log(err)
    }
}