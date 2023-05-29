import Express from "express"
import cookieParser from "cookie-parser";
import cors from 'cors';

import {apiServer, clientServer, storagePath} from "../config";
import {connectDB} from "./dbController/dbConnect";
import {syncDB} from "./dbController/syncDB";
import authRoute from "./routes/authRoute";
import {errorMiddleware} from "./middlewares/errorMiddleware";
import userRouter from "./routes/userPageRoute";
import multer from "multer";
import {nanoid} from "nanoid";

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, storagePath)
    },
    filename: (req, file, callback) => {
        callback(null, nanoid())
    }
})

export const app = Express()

app.use(Express.json())
app.use(Express.urlencoded({extended: true}))
app.use(multer({storage: storage}).single('file'))


app.use(cors({
    credentials: true,
    origin: clientServer.url
}))
app.use(cookieParser())

app.use('/api/auth', authRoute)
app.use('/api/userPage', userRouter)
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