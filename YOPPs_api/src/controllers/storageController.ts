import { NextFunction, Request, Response } from 'express';
import StorageService from '../services/storageService';
import storageService from '../services/storageService';

class StorageController {
  static async uploadFile(req: Request, res: Response, next: NextFunction) {
    try {
      const file = req.file;
      console.log(file);
      const { userUUID } = req.params;
      const fileDto = await StorageService.uploadFile(file, userUUID, 'avatar');
      return res.status(201).json(fileDto);
    } catch (err) {
      next(err);
    }
  }

  static async getAvatarByUUID(req: Request, res: Response, next: NextFunction) {
    try {
      const { userUUID } = req.params;
      const fileName = await StorageService.getFileName(userUUID);
      const buffer = await StorageService.getFile(fileName);

      res.setHeader('Content-Type', 'image/png');
      return res.send(buffer);
    } catch (err) {
      next(err);
    }
  }

  static async getAvatarByUsername(req: Request, res: Response, next: NextFunction) {
    try {
      const { username } = req.params;
      const fileName = await StorageService.getFileName(username);
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