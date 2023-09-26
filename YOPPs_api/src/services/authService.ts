import MailService from './mailService';
import TokenService from './tokenService';
import { UserModel } from '../models/User-model';
import { ApiError } from '../Errors/ApiErrors';
import { apiServer, bcryptSalt, PWDCodeExpireIn } from '../config';

import { UserPageModel } from '../models/UserPage-model';
import { User } from '../Dto/User';
import {
  AuthExceptions,
  TokenExceptions,
} from '../Errors/HttpExceptionsMessages';
import { UserData } from '../entities/UserData';
import { ActivationLinksModel } from '../models/ActivationLinksModel';
import { PWDResetCodeModel } from '../models/PWDResetCode-model';
import { MailDto } from '../Dto/MailDto';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';

abstract class AuthService {
  static async registration(
    username: string,
    email: string,
    password: string,
  ): Promise<UserData> {
    const user: UserModel | null = await UserModel.findOne({
      where: { email },
    });
    if (user) throw ApiError.BadRequest(AuthExceptions.UserAlreadyExists);

    const hashPassword = bcrypt.hashSync(password, bcryptSalt);
    const userEntity: UserModel = await UserModel.create({
      username,
      email,
      password: hashPassword,
    });

    UserPageModel.create({ userUUID: userEntity.UUID });

    const userDto: User = {
      UUID: userEntity.UUID,
      username: userEntity.username,
      refreshUUID: uuidv4(),
      isActivated: userEntity.isActivated,
    };
    const activationCode: string = uuidv4();
    await ActivationLinksModel.create({
      userUUID: userEntity.UUID,
      linkCode: activationCode,
    });
    const link = `${apiServer.url}/auth/activate/${activationCode}`;
    MailService.sendMail(new MailDto('activate', email, link));

    const tokens = TokenService.generateTokens(userDto);
    await TokenService.saveRefreshToken(userDto.UUID, userDto.refreshUUID);

    return { ...tokens, user: userDto };
  }

  static async activate(code: string) {
    const databaseNote = await ActivationLinksModel.findOne({
      where: { linkCode: code },
    });
    if (!databaseNote)
      throw ApiError.BadRequest(TokenExceptions.InvalidActivationURL);

    const user = await UserModel.findOne({
      where: { UUID: databaseNote.userUUID },
    });
    if (!user) throw ApiError.NotFound(AuthExceptions.UserNotFound);
    user.isActivated = true;
    databaseNote.destroy();
    await user.save();
  }

  static async login(email: string, password: string): Promise<UserData> {
    const user = await UserModel.findOne({ where: { email } });
    if (!user) throw ApiError.BadRequest(AuthExceptions.UserNotFound);

    const isPassEquals = await bcrypt.compare(password, user.password);
    if (!isPassEquals) throw ApiError.BadRequest(AuthExceptions.WrongPassword);
    const userDto: User = {
      UUID: user.dataValues.UUID,
      username: user.dataValues.username,
      refreshUUID: uuidv4(),
      isActivated: user.dataValues.isActivated,
    };
    const tokens = TokenService.generateTokens(userDto);
    await TokenService.saveRefreshToken(userDto.UUID, userDto.refreshUUID);

    return { ...tokens, user: userDto };
  }

  static async refresh(refreshToken: string): Promise<UserData> {
    if (!refreshToken)
      throw ApiError.UnauthorizedError(TokenExceptions.InvalidToken);
    const userData = TokenService.validateToken(refreshToken);
    if (!userData)
      throw ApiError.UnauthorizedError(TokenExceptions.InvalidToken);

    const tokenFromDB = await TokenService.findToken(userData?.refreshUUID);
    if (!tokenFromDB)
      throw ApiError.UnauthorizedError(TokenExceptions.InvalidToken);

    const user = await UserModel.findOne({ where: { UUID: userData.UUID } });
    const userDto: User = {
      UUID: user?.dataValues.UUID,
      username: user?.dataValues.username,
      refreshUUID: uuidv4(),
      isActivated: user?.dataValues.isActivated,
    };
    const tokens = TokenService.generateTokens({ ...userDto });
    await TokenService.saveRefreshToken(userDto.UUID, userDto.refreshUUID);

    return { ...tokens, user: userDto };
  }

  static async logout(refreshToken: string): Promise<void> {
    await TokenService.removeToken(refreshToken);
  }

  static async sendResetEmail(email: string) {
    const user = await UserModel.findOne({ where: { email } });
    if (!user) throw ApiError.NotFound(AuthExceptions.UserNotFound);
    const code = uuidv4();
    await PWDResetCodeModel.create({
      userUUID: user.UUID,
      code: code,
      expireIn:
        Date.now() + Number(PWDCodeExpireIn.slice(0, -1)) * 60 * 60 * 1000,
    });
    const link = `${apiServer.url}/auth/resetPassword/${code}`;
    MailService.sendMail(new MailDto('PWDReset', email, link));
  }

  static async resetPWD(code: string, newPassword: string) {
    const dbWrite = await PWDResetCodeModel.findOne({ where: { code } });
    if (!dbWrite) throw ApiError.NotFound(TokenExceptions.InvalidCode);
    if (new Date(dbWrite.expireIn) < new Date(Date.now())) {
      await dbWrite.destroy();
      throw ApiError.BadRequest(TokenExceptions.Expired);
    }

    const user = await UserModel.findOne({ where: { UUID: dbWrite.userUUID } });
    if (!user) throw ApiError.NotFound(AuthExceptions.UserNotFound);
    await dbWrite.destroy();

    user.password = bcrypt.hashSync(newPassword, bcryptSalt);
    await user.save();
  }

  static async resendActivateEmail(email: string, userData: User) {
    await ActivationLinksModel.destroy({ where: { userUUID: userData.UUID } });
    const activateObj = await ActivationLinksModel.create({
      userUUID: userData.UUID,
      code: uuidv4(),
    });
    MailService.sendMail(new MailDto('activate', email, activateObj.linkCode));
  }
}

export default AuthService;
