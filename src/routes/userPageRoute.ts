import {IRouter, Router} from "express";
import UserPageController from "../controllers/userPageController";

const userRouter: IRouter = Router();


userRouter.post('/save', UserPageController.savePage)
userRouter.get('/get', UserPageController.getPageData)


export default userRouter;