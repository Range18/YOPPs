import UserPageService from './userPageService';
import { UserIntercepted } from '../user/types/user-intercepted';
import { NextFunction, Request, Response } from 'express';

abstract class UserPageController {
  static async savePage(
    req: Request & { user: UserIntercepted },
    res: Response,
    next: NextFunction,
  ) {
    try {
      const userPageData = req.body;
      const { UUID } = req.user;

      await UserPageService.saveUserPage(UUID, userPageData);

      res.status(201).json({ message: 'OK' });
      next();
    } catch (err) {
      next(err);
    }
  }

  static async getPage(req: Request, res: Response, next: NextFunction) {
    try {
      const { usernameOrUUID } = req.params;

      const userPageData = await UserPageService.getPageData(usernameOrUUID);

      res.json(userPageData);

      next();
    } catch (err) {
      next(err);
    }
  }
}

export default UserPageController;
