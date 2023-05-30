import { NextFunction, Request, Response } from 'express';
import StorageService from '../services/storageService';
import storageService from '../services/storageService';

abstract class StorageController {
  static async uploadFile(req: Request, res: Response, next: NextFunction) {
    try {
      const file = req.file;
      console.log(file);
      const { userUUID } = req.params;
      await StorageService.uploadFile(file, userUUID, 'avatar');
      return res.status(201).json({message: 'OK'});
    } catch (err) {
      next(err);
    }
  }

  static async getAvatar(req: Request, res: Response, next: NextFunction) {
    try {
      const { usernameOrUUID } = req.params;
      const fileName = await StorageService.getFileName(usernameOrUUID);
      const buffer = await StorageService.getFile(fileName);

      res.setHeader('Content-Type', 'image/png');
      return res.send(buffer);
    } catch (err) {
      next(err);
    }
  }

  static async removeAvatar(req: Request, res: Response, next: NextFunction) {
    try {
      const { userUUID } = req.params;
      const fileName = await StorageService.getFileName(userUUID)
      await StorageService.deleteFile(fileName)
      return res.status(204).json({ message: 'OK' });
    } catch (err) {
      next(err);
    }
  }
}

export default StorageController;