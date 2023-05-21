import Express from "express"
import cookieParser from "cookie-parser";
import cors from 'cors';

import {apiServer, clientServer} from "../config";
import {connectDB} from "./dbController/dbConnect";
import {syncDB} from "./dbController/syncDB";
import authRoute from "./routes/authRoute";
import {errorMiddleware} from "./middlewares/errorMiddleware";
import userRouter from "./routes/userPageRoute";


const app = Express()

app.use(Express.json())



app.use(cors({
    credentials: true,
    origin: clientServer.url
}))
app.use(cookieParser())

app.use('/api/auth', authRoute)
app.use('/api/userPage',userRouter)
app.use(errorMiddleware)
const startApp = async () => {
    try {
        await connectDB()
        await syncDB()
        app.listen(apiServer.port, () => console.log(`Server is started at http://${apiServer.host}:${apiServer.port}`))
    } catch (err) {
        console.log(err)
    }
}

startApp()