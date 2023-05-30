import { unlink } from 'fs/promises';
import { createReadStream } from 'fs';
import { Buffer } from 'buffer';


import { IFileDto } from '../Dto/IFileDto';
import { ApiError } from '../Errors/ApiErrors';
import { UserPageExceptions } from '../Errors/HttpExceptionsMessages';
import { FileModel } from '../models/File-model';
import { storageSettings } from '../../config';
import multer, { FileFilterCallback } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { UserProfilePageModel } from '../models/UserProfilePageModel';
import { UserModel } from '../models/userModel';


abstract class StorageService {
  static readonly storageConfig = multer.diskStorage({
    destination: (req, file, callback) => {
      callback(null, storageSettings.destination);
    },
    filename: (req, file, callback) => {
      callback(null, uuidv4() + '.' + file.mimetype.split('/')[1]);
    },
  });

  static async getFileName(userField: string): Promise<string | null> {
    const parentPage = await UserProfilePageModel.findOne({
      where: [{ userUUID: userField },
        {
          userUUID: (await UserModel.findOne({ where: { username: userField } }))?.UUID,
        },
      ],
    });
    if (!parentPage) throw ApiError.NotFound(UserPageExceptions.PageNotFound);
    const file = await FileModel.findOne({ where: { id: parentPage?.avatarId } });
    return file?.fileName ?? null;
  }

  static async getFile(fileName: string | null): Promise<Buffer> {
    fileName = fileName ?? storageSettings.defaultAvatar;
    const readableStream = createReadStream(storageSettings.destination + '\\' + fileName);
    const chunks: any[] = [];

    return new Promise(resolve => {
      readableStream.on('data', (chunk) => {
        chunks.push(chunk);
      });
      readableStream.on('end', () => {
        resolve(Buffer.concat(chunks));
      });
    });

  }

  static async uploadFile(fileData: Express.Multer.File | undefined, userUUID: string, fileTypeField: string): Promise<IFileDto> {
    if (!fileData) throw ApiError.NotFound(UserPageExceptions.NoFile);
    if (!await StorageService.checkFileExtension(fileData.filename, fileData.mimetype)) {
      StorageService.deleteFile(fileData.filename);
      throw ApiError.BadRequest(UserPageExceptions.ExtensionNotAllowed);
    }
    const page = await UserProfilePageModel.findOne({ where: { userUUID: userUUID } });
    if (!page) throw ApiError.NotFound(UserPageExceptions.PageNotFound);

    const copyOfFile = await FileModel.findOne({ where: { userUUID: userUUID, type: fileTypeField } });
    if (copyOfFile) {
      unlink(storageSettings.destination + '\\' + copyOfFile.fileName);
      await copyOfFile.update({
        fileName: fileData.filename,
        size: fileData.size,
      });
      await page.update({
        avatarId: copyOfFile.id,
      });
    } else {
      const newFile = await FileModel.create({
        userUUID: userUUID,
        fileName: fileData.filename,
        type: fileTypeField,
        size: fileData.size,
      });
      await page.update({
        avatarId: newFile.id,
      });
    }
    return {
      originalName: fileData.originalname,
      filename: fileData.filename,
      type: fileTypeField,
      mimetype: fileData.mimetype,
      encoding: fileData.encoding,
      destination: fileData.destination,
      path: fileData.path,
      size: fileData.size,
    };
  }

  static async deleteFile(fileName: string | null): Promise<void> {
    if (!fileName) throw ApiError.NotFound(UserPageExceptions.ImgNotFound);
    unlink(storageSettings.destination + '\\' + fileName);
    const file = await FileModel.findOne({ where: { fileName } });
    file?.destroy();
  }

  static fileFilter(req: Express.Request, file: Express.Multer.File, callback: FileFilterCallback): void {
    if (Array.from(storageSettings.allowedExtensions.keys()).includes(file.mimetype)) {
      callback(null, true);
    } else {
      callback(null, false);
    }
  }

  static async checkFileExtension(filename: string, mimeType: string): Promise<boolean> {
    const buffer = await StorageService.getFile(filename);
    const bufferString = buffer.toString('hex').toLocaleUpperCase();
    return bufferString.startsWith(storageSettings.allowedExtensions.get(mimeType)!);
  }
}

export default StorageService;