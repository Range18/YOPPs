import { FileModel } from './File.model';
import UserPageService from '../page/userPageService';
import { ApiError } from '../Errors/ApiErrors';
import { UserPageExceptions } from '../Errors/HttpExceptionsMessages';
import { storageSettings } from '../config';
import multer, { FileFilterCallback } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { Buffer } from 'buffer';
import { createReadStream, statSync } from 'fs';
import { unlink } from 'fs/promises';
import path from 'path';

abstract class StorageService {
  static readonly storageConfig = multer.diskStorage({
    destination: (req, file, callback) => {
      callback(null, storageSettings.destination);
    },
    filename: (req, file, callback) => {
      callback(null, uuidv4() + '.' + file.mimetype.split('/')[1]);
    },
  });

  static fileFilter(
    req: Express.Request,
    file: Express.Multer.File,
    callback: FileFilterCallback,
  ): void {
    if (
      Array.from(storageSettings.allowedExtensions.keys()).includes(
        file.mimetype,
      )
    ) {
      callback(null, true);
    } else {
      callback(ApiError.BadRequest(UserPageExceptions.ExtensionNotAllowed));
    }
  }

  private static async checkFileExtension(
    filename: string,
    mimeType: string,
  ): Promise<boolean> {
    const buffer = await StorageService.getFile(filename);

    const bufferString = buffer.toString('hex').toLocaleUpperCase();
    return bufferString.startsWith(
      storageSettings.allowedExtensions.get(mimeType)!,
    );
  }

  private static checkFileSize(filename: string): boolean {
    const fileSize = statSync(
      `${storageSettings.destination}\\${filename}`,
    ).size;
    return fileSize <= storageSettings.maxFileSize;
  }

  static async getFileName(userField: string): Promise<string | null> {
    const parentPage = await UserPageService.getPage(userField);
    if (!parentPage) throw ApiError.NotFound(UserPageExceptions.PageNotFound);
    const file = await FileModel.findOne({
      where: { id: parentPage?.avatarId },
    });
    return file?.fileName ?? null;
  }

  static getFileExt(filename: string): string {
    return path.extname(filename).slice(1);
  }

  static async getFile(fileName: string | null): Promise<Buffer> {
    fileName = fileName ?? storageSettings.defaultAvatar;

    const readableStream = createReadStream(
      storageSettings.destination + '\\' + fileName,
    );
    const chunks: any[] = [];

    return new Promise((resolve) => {
      readableStream.on('data', (chunk) => {
        chunks.push(chunk);
      });

      readableStream.on('end', () => {
        resolve(Buffer.concat(chunks));
      });
    });
  }

  static async uploadFile(
    fileData: Express.Multer.File | undefined,
    userUUID: string,
    fileTypeField: string,
  ) {
    if (!fileData) throw ApiError.NotFound(UserPageExceptions.NoFile);

    const isExtAllowed = await StorageService.checkFileExtension(
      fileData.filename,
      fileData.mimetype,
    );

    if (!isExtAllowed) {
      StorageService.deleteFile(fileData.filename);
      throw ApiError.BadRequest(UserPageExceptions.ExtensionNotAllowed);
    }

    const isSizeAllowed = StorageService.checkFileSize(fileData.filename);

    if (!isSizeAllowed) {
      StorageService.deleteFile(fileData.filename);
      throw ApiError.BadRequest(UserPageExceptions.MaxSizeExceeded);
    }

    const page = await UserPageService.getPage(userUUID);
    if (!page) throw ApiError.NotFound(UserPageExceptions.PageNotFound);

    const copyOfFile = await FileModel.findOne({
      where: { userUUID: userUUID, type: fileTypeField },
    });

    if (copyOfFile) {
      unlink(storageSettings.destination + '\\' + copyOfFile.fileName);
      await copyOfFile.update({
        fileName: fileData.filename,
        size: fileData.size,
      });
    } else {
      const newFile = await FileModel.create({
        userUUID: page.userUUID,
        fileName: fileData.filename,
        type: fileTypeField,
        size: fileData.size,
      });
      await page.update({
        avatarId: newFile.id,
      });
    }
  }

  static async deleteFile(fileName: string | null): Promise<void> {
    if (!fileName) throw ApiError.NotFound(UserPageExceptions.ImgNotFound);

    unlink(storageSettings.destination + '\\' + fileName);

    const file = await FileModel.findOne({ where: { fileName } });

    file?.destroy();
  }
}

export default StorageService;
