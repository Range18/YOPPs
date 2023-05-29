import {NextFunction, Request, Response} from "express";
import {ApiError} from "../Errors/ApiErrors";
import {UserPageExceptions} from "../Errors/HttpExceptionsMessages";
import {IFileDto} from "../Dto/IFileDto";
import {IFile} from "../entities/IFile";
import StorageService from "../services/storageService";

class StorageController {

    static async uploadAvatar(req: Request, res: Response, next: NextFunction) {
        try{
            const file = req.file
            const pageUUID = req.params
            const fileDto = await StorageService.uploadAvatar(file)
            return res.status(201).json({fileDto,message: 'OK'})
        } catch (err){
            next(err)
        }
    }
}

export default StorageController;