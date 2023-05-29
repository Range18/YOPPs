import {IRouter, Router} from "express";
import AuthController from "../controllers/authController";
const authRoute: IRouter = Router()

authRoute.post('/registration', AuthController.registration)
authRoute.post('/login', AuthController.login)
authRoute.post('/activate/:link',AuthController.activate)
authRoute.post('/refresh', AuthController.refresh)
authRoute.delete('/logout', AuthController.logout)

export default authRoute;