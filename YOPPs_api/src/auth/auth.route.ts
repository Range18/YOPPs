import AuthController from './auth.controller';
import { authMiddleware } from '../middlewares/authMiddleware';
import { IRouter, Router } from 'express';

const authRoute: IRouter = Router();

authRoute.post('/registration', AuthController.registration);

authRoute.post('/login', AuthController.login);

authRoute.get('/activate/:link', AuthController.activate);
authRoute.post(
  '/email/send/activation',
  authMiddleware,
  AuthController.resendActivateEmail,
);

authRoute.post('/refresh', authMiddleware, AuthController.refresh);

authRoute.delete('/logout', AuthController.logout);

authRoute.post('/email/send/reset', AuthController.sendResetPWDEmail);

authRoute.patch('/password/reset/:code', AuthController.resetPWD);
export default authRoute;
