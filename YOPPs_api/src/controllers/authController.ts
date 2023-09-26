import AuthService from '../services/authService';
import { clientServer, jwtSettings } from '../config';
import { UserDto } from '../entities/UserDto';
import { NextFunction, Request, Response } from 'express';

abstract class AuthController {
  private static maxAgeRefreshToken =
    Number(jwtSettings.authExpires.refresh.slice(0, -1)) * 24 * 60 * 60 * 1000;

  static async registration(req: Request, res: Response, next: NextFunction) {
    try {
      const { username, email, password } = req.body;
      const userData = await AuthService.registration(
        username,
        email,
        password,
      );

      res.cookie('refreshToken', userData.refreshToken, {
        maxAge: AuthController.maxAgeRefreshToken,
        httpOnly: true,
      });

      const userDataPreview: UserDto = {
        accessToken: userData.accessToken,
        user: userData.user,
      };

      res.status(201).json(userDataPreview);
      next();
    } catch (err) {
      next(err);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const userData = await AuthService.login(email, password);

      res.cookie('refreshToken', userData.refreshToken, {
        maxAge: AuthController.maxAgeRefreshToken,
        httpOnly: true,
      });

      const userDataPreview: UserDto = {
        accessToken: userData.accessToken,
        user: userData.user,
      };

      res.status(201).json(userDataPreview);
      next();
    } catch (err) {
      next(err);
    }
  }

  static async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.cookies;
      await AuthService.logout(refreshToken);
      res.clearCookie('refreshToken');
      res.json({ message: 'OK' });
      next();
    } catch (err) {
      next(err);
    }
  }

  static async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.cookies;
      const userData = await AuthService.refresh(refreshToken);
      await AuthService.logout(refreshToken);
      res.cookie('refreshToken', userData.refreshToken, {
        maxAge: AuthController.maxAgeRefreshToken,
        httpOnly: true,
      });
      const userDataPreview: UserDto = {
        accessToken: userData.accessToken,
        user: userData.user,
      };
      res.json(userDataPreview);
      next();
    } catch (err) {
      next(err);
    }
  }

  static async resendActivateEmail(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { email } = req.body;
      const userData = req['user'];
      await AuthService.resendActivateEmail(email, userData);
      next();
    } catch (err) {
      next(err);
    }
  }

  static async activate(req: Request, res: Response, next: NextFunction) {
    try {
      const code = req.params.link;
      await AuthService.activate(code);
      res.redirect(clientServer.url);
      next();
    } catch (err) {
      next(err);
    }
  }

  static async sendResetPWDEmail(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { email } = req.body;
      await AuthService.sendResetEmail(email);
      res.status(204).json();
      next();
    } catch (err) {
      next(err);
    }
  }

  static async resetPWD(req: Request, res: Response, next: NextFunction) {
    try {
      const { code } = req.params;
      const { password } = req.body;
      await AuthService.resetPWD(code, password);
      res.status(204).json();
      next();
    } catch (err) {
      next(err);
    }
  }
}

export default AuthController;
