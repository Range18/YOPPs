import { IRouter, Router } from 'express';
import UserPageController from '../controllers/userPageController';
import { authorizedAndActivated } from '../middlewares/authorizedAndActivated';
import storageController from '../controllers/storageController';

const userRouter: IRouter = Router();

userRouter.post('/save', authorizedAndActivated, UserPageController.savePage);
userRouter.get('/getByUsername/:username', UserPageController.getPage);

userRouter.post('/assets/save/userAvatar/:userUUID', authorizedAndActivated, storageController.uploadFile);
userRouter.get('/assets/get/userAvatar/:userUUID', storageController.getAvatarByUUID);
userRouter.get('/assets/get/userAvatar/:username', storageController.getAvatarByUsername);
userRouter.delete('/assets/delete/userAvatar/:userUUID', authorizedAndActivated, storageController.removeAvatar);
export default userRouter;