import { IRouter, Router } from 'express';
import AuthController from '../controllers/authController';
import { authMiddleware } from '../middlewares/authMiddleware';

const authRoute: IRouter = Router();

authRoute.post('/registration', AuthController.registration);
authRoute.post('/login', AuthController.login);
authRoute.get('/activate/:link', AuthController.activate);
authRoute.post('/activate/resendActivationEmail/', authMiddleware, AuthController.resendActivateEmail)
authRoute.post('/refresh', authMiddleware, AuthController.refresh);
authRoute.delete('/logout', AuthController.logout);

authRoute.post('/sendResetEmail', AuthController.sendResetPWDEmail);
authRoute.patch('/resetPassword/:code', AuthController.resetPWD);
export default authRoute;