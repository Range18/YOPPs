import MailService from '../mail/mail.service';
import TokenService from '../session/tokenService';
import { UserModel } from '../user/User-model';
import { ApiError } from '../Errors/ApiErrors';
import { apiServer, bcryptSalt, PWDCodeExpireIn } from '../config';

import { UserPageModel } from '../page/UserPage-model';
import { UserPayload } from '../user/user-payload';
import {
  AuthExceptions,
  TokenExceptions,
} from '../Errors/HttpExceptionsMessages';
import { UserData } from '../user/user-data';
import { ActivationLinksModel } from '../mail/activation-links.model';
import { PassResetModel } from '../mail/pass-reset.model';
import { MailDto } from '../mail/MailDto';
import { SessionService } from '../session/session.service';
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

    const hashPassword = await bcrypt.hash(password, bcryptSalt);

    const userEntity: UserModel = await UserModel.create({
      username,
      email,
      password: hashPassword,
    });

    UserPageModel.create({ userUUID: userEntity.UUID });

    const userDto: UserPayload = {
      UUID: userEntity.UUID,
      username: userEntity.username,
      refreshUUID: uuidv4(),
    };

    const activationCode: string = uuidv4();

    await ActivationLinksModel.create({
      userUUID: userEntity.UUID,
      linkCode: activationCode,
    });

    const link = `${apiServer.url}/auth/activate/${activationCode}`;
    MailService.sendMail(new MailDto('activate', email, link));

    const tokens = TokenService.generate(userDto);
    await SessionService.create(userDto.UUID, userDto.refreshUUID);

    return { ...tokens, user: userDto };
  }

  static async activate(code: string) {
    const linkModel = await ActivationLinksModel.findOne({
      where: { linkCode: code },
    });

    if (!linkModel)
      throw ApiError.BadRequest(TokenExceptions.InvalidActivationURL);

    const user = await UserModel.findOne({
      where: { UUID: linkModel.userUUID },
    });

    if (!user) throw ApiError.NotFound(AuthExceptions.UserNotFound);

    user.isActivated = true;
    linkModel.destroy();
    await user.save();
  }

  static async login(email: string, password: string): Promise<UserData> {
    const user = await UserModel.findOne({ where: { email } });

    if (!user) throw ApiError.BadRequest(AuthExceptions.UserNotFound);

    const isPassEquals = await bcrypt.compare(password, user.password);

    if (!isPassEquals) throw ApiError.BadRequest(AuthExceptions.WrongPassword);

    const userDto: UserPayload = {
      UUID: user.dataValues.UUID,
      username: user.dataValues.username,
      refreshUUID: uuidv4(),
    };

    const tokens = TokenService.generate(userDto);
    await SessionService.create(userDto.UUID, userDto.refreshUUID);

    return { ...tokens, user: userDto };
  }

  static async refresh(refreshToken: string): Promise<UserData> {
    if (!refreshToken)
      throw ApiError.UnauthorizedError(TokenExceptions.InvalidToken);

    const userData = TokenService.validate<UserPayload>(refreshToken);

    if (!userData)
      throw ApiError.UnauthorizedError(TokenExceptions.InvalidToken);

    const session = await SessionService.find(userData?.refreshUUID);

    if (!session)
      throw ApiError.UnauthorizedError(TokenExceptions.InvalidToken);

    const user = await UserModel.findOne({ where: { UUID: userData.UUID } });

    const userDto: UserPayload = {
      UUID: user?.dataValues.UUID,
      username: user?.dataValues.username,
      refreshUUID: uuidv4(),
    };

    const tokens = TokenService.generate({ ...userDto });
    await SessionService.create(userDto.UUID, userDto.refreshUUID);

    return { ...tokens, user: userDto };
  }

  static async logout(refreshToken: string): Promise<void> {
    await SessionService.remove(refreshToken);
  }

  static async sendResetEmail(email: string) {
    const user = await UserModel.findOne({ where: { email } });

    if (!user) throw ApiError.NotFound(AuthExceptions.UserNotFound);

    const code = uuidv4();

    await PassResetModel.create({
      userUUID: user.UUID,
      code: code,
      expireAt:
        Date.now() + Number(PWDCodeExpireIn.slice(0, -1)) * 60 * 60 * 1000,
    });

    const link = `${apiServer.url}/auth/resetPassword/${code}`;
    MailService.sendMail(new MailDto('PWDReset', email, link));
  }

  static async resetPWD(code: string, newPassword: string) {
    const resetCodeModel = await PassResetModel.findOne({ where: { code } });

    if (!resetCodeModel) throw ApiError.NotFound(TokenExceptions.InvalidCode);

    if (new Date(resetCodeModel.expireAt) < new Date(Date.now())) {
      await resetCodeModel.destroy();
      throw ApiError.BadRequest(TokenExceptions.Expired);
    }

    const user = await UserModel.findOne({
      where: { UUID: resetCodeModel.userUUID },
    });

    if (!user) throw ApiError.NotFound(AuthExceptions.UserNotFound);

    await resetCodeModel.destroy();

    user.password = await bcrypt.hash(newPassword, bcryptSalt);
    await user.save();
  }

  static async resendActivateEmail(email: string, userData: UserPayload) {
    await ActivationLinksModel.destroy({ where: { userUUID: userData.UUID } });

    const linkModel = await ActivationLinksModel.create({
      userUUID: userData.UUID,
      code: uuidv4(),
    });

    MailService.sendMail(new MailDto('activate', email, linkModel.linkCode));
  }
}

export default AuthService;
