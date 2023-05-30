import { IRouter, Router } from 'express';
import UserPageController from '../controllers/userPageController';
import { authorizedAndActivated } from '../middlewares/authorizedAndActivated';
import storageController from '../controllers/storageController';

const userRouter: IRouter = Router();

userRouter.post('/save', authorizedAndActivated, UserPageController.savePage);
userRouter.get('/get/:usernameOrUUID', UserPageController.getPage);


userRouter.post('/save/assets/avatar/:userUUID', authorizedAndActivated, storageController.uploadFile);
userRouter.get('/get/assets/avatar/:usernameOrUUID', storageController.getAvatar);
userRouter.delete('/delete/assets/userAvatar/:userUUID', authorizedAndActivated, storageController.removeAvatar);
export default userRouter;