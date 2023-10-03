import UserPageController from './userPageController';
import { VerifiedMiddleware } from '../middlewares/verifiedMiddleware';
import storageController from '../storage/storage.controller';
import { authMiddleware } from '../middlewares/authMiddleware';
import { IRouter, Router } from 'express';

const userRouter: IRouter = Router();

userRouter.post(
  '/save',
  authMiddleware,
  VerifiedMiddleware,
  UserPageController.savePage,
);
userRouter.get('/get/:usernameOrUUID', UserPageController.getPage);

userRouter.post(
  '/save/assets/avatar',
  authMiddleware,
  VerifiedMiddleware,
  storageController.uploadFile,
);
userRouter.get(
  '/get/assets/avatar/:usernameOrUUID',
  storageController.getAvatar,
);
userRouter.delete(
  '/delete/assets/userAvatar',
  authMiddleware,
  VerifiedMiddleware,
  storageController.removeAvatar,
);
export default userRouter;
