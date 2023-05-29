import fs from 'node:fs'
import {IFileDto} from "../Dto/IFileDto";
import {ApiError} from "../Errors/ApiErrors";
import {UserPageExceptions} from "../Errors/HttpExceptionsMessages";
import {FileModel} from "../models/File-model";

class StorageService {

    async getFile(filename: string) {
    }
//  TODO pageUUID and problem with write
    async uploadAvatar(fileData: Express.Multer.File | undefined): Promise<IFileDto> {
        if (!fileData) {
            throw ApiError.BadRequest(UserPageExceptions.NoFile)
        }
        console.log(fileData)
        const writableStream = fs.createWriteStream(fileData.path + '.' + fileData.mimetype.split("/")[1])
        writableStream.write(fileData.buffer)
        writableStream.close()
        await FileModel.create({
            originalName: fileData.originalname,
            fileName: fileData.filename,
            type: 'avatar',
            size: fileData.size
        })
        const fileDto: IFileDto = {
            originalName: fileData.originalname,
            filename: fileData.filename,
            type: 'avatar',
            mimetype: fileData.mimetype,
            encoding: fileData.encoding,
            destination: fileData.destination,
            path: fileData.path + '.' + fileData.mimetype.split("/")[1],
            size: fileData.size
        }
        return fileDto;
    }
}

export default new StorageService();