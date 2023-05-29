import {IRouter, Router} from "express";
import UserPageController from "../controllers/userPageController";
import {authorizedAndActivated} from "../middlewares/authorizedAndActivated";
import storageController from "../controllers/storageController";

const userRouter: IRouter = Router();

userRouter.post('/save', authorizedAndActivated, UserPageController.savePage)
userRouter.get('/getByUsername/:username', UserPageController.getPage)
userRouter.post('/assets/save/userAvatar', storageController.uploadAvatar)

export default userRouter;