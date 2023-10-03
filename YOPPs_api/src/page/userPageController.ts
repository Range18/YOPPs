import UserPageService from './userPageService';
import { NextFunction, Request, Response } from 'express';

abstract class UserPageController {
  static async savePage(req: Request, res: Response, next: NextFunction) {
    try {
      const userPageData = req.body;
      await UserPageService.saveUserPage(userPageData);
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
