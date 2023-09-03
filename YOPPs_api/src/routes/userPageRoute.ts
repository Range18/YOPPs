import { IRouter, Router } from 'express';
import UserPageController from '../controllers/userPageController';
import { activatedMiddleware } from '../middlewares/activatedMiddleware';
import storageController from '../controllers/storageController';
import { authMiddleware } from '../middlewares/authMiddleware';

const userRouter: IRouter = Router();

userRouter.post('/save', authMiddleware, activatedMiddleware, UserPageController.savePage);
userRouter.get('/get/:usernameOrUUID', UserPageController.getPage);


userRouter.post('/save/assets/avatar', authMiddleware,activatedMiddleware, storageController.uploadFile);
userRouter.get('/get/assets/avatar/:usernameOrUUID', storageController.getAvatar);
userRouter.delete('/delete/assets/userAvatar', authMiddleware, activatedMiddleware, storageController.removeAvatar);
export default userRouter;