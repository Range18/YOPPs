import {IRouter, Router} from "express";
import UserPageController from "../controllers/userPageController";
import {authMiddleware} from "../middlewares/authMiddleware";
import {authorizedAndActivated} from "../middlewares/authorizedAndActivated";

const userRouter: IRouter = Router();


userRouter.post('/save', authorizedAndActivated, UserPageController.savePage)
userRouter.get('/get/private', authMiddleware, UserPageController.getPrivatePage)
userRouter.get('/get/public/:username', UserPageController.getPublicPage)



export default userRouter;