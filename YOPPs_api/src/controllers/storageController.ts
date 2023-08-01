import { NextFunction, Request, Response } from 'express';
import StorageService from '../services/storageService';
import { storageSettings } from '../config';
import { User } from '../Dto/User';


abstract class StorageController {
    static async uploadFile(req: Request, res: Response, next: NextFunction) {
        try {
            const file = req.file;
            const user : User = req['user']
            await StorageService.uploadFile(file, user.UUID, 'avatar');
            res.status(201).json({ message: 'OK' });
            next()
        } catch (err) {
            next(err);
        }
    }

    static async getAvatar(req: Request, res: Response, next: NextFunction) {
        try {
            const { usernameOrUUID } = req.params;
            const fileName = await StorageService.getFileName(usernameOrUUID);
            const buffer = await StorageService.getFile(fileName);
            const fileExt = StorageService.getFileExt(fileName ?? storageSettings.defaultAvatar);

            res.setHeader('Content-Type', `image/${fileExt}`);
            res.send(buffer);
            next()
        } catch (err) {
            next(err);
        }
    }

    static async removeAvatar(req: Request, res: Response, next: NextFunction) {
        try {
            const user: User = req['user']
            const fileName = await StorageService.getFileName(user.UUID);
            await StorageService.deleteFile(fileName);
            res.status(204).json({ message: 'OK' });
            next()
        } catch (err) {
            next(err);
        }
    }
}

export default StorageController;