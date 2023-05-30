import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

import { UserModel } from '../models/userModel';
import { ApiError } from '../Errors/ApiErrors';
import { apiServer, bcryptSalt } from '../../config';

import MailService from './mailService';
import TokenService from './tokenService';
import { UserPageModel } from '../models/UserPageModel';
import { IUserDto } from '../Dto/IUserDto';
import { AuthExceptions, TokenExceptions } from '../Errors/HttpExceptionsMessages';
import { IUserData } from '../entities/IUserData';
import { Token } from '../models/Token-model';


abstract class AuthService {
    static async registration(username: string, email: string, password: string): Promise<IUserData> {
        const candidate: UserModel | null = await UserModel.findOne({where: {email}})
        if (candidate) throw ApiError.BadRequest(AuthExceptions.UserAlreadyExists);

        const hashPassword = bcrypt.hashSync(password, bcryptSalt);
        const user: UserModel = await UserModel.create({
            username,
            email,
            password: hashPassword,
        })

        UserPageModel.create({userUUID: user.UUID})

        const userDto: IUserDto = {
            UUID: user.UUID,
            username: user.username,
            refreshUUID: uuidv4(),
            isActivated: user.isActivated
        }
        const activationLink: string = TokenService.generateActivationToken(userDto)

        MailService.sendActivationMail(email, `${apiServer.url}/api/auth/activate/${activationLink}`)

        const tokens = TokenService.generateTokens(userDto)
        await TokenService.saveRefreshToken(userDto.UUID, userDto.refreshUUID)

        return {...tokens, user: userDto}
    }

    static async activate(token: string) {
        const tokenData = TokenService.validateToken(token)
        if (!tokenData) throw ApiError.BadRequest(TokenExceptions.InvalidActivationURL);

        const UUID = tokenData.UUID
        const user = await UserModel.findOne({where: {UUID}})
        if (!user) throw ApiError.BadRequest(TokenExceptions.InvalidActivationURL);

        user.isActivated = true
        await user.save()
    }

    static async login(email: string, password: string): Promise<IUserData> {
        const user = await UserModel.findOne({where: {email}})
        if (!user) throw ApiError.BadRequest(AuthExceptions.UserNotFound);

        const isPassEquals = await bcrypt.compare(password, user.password)
        if (!isPassEquals) throw ApiError.BadRequest(AuthExceptions.WrongPassword);
        const userDto: IUserDto = {
            UUID: user.dataValues.UUID,
            username: user.dataValues.username,
            refreshUUID: uuidv4(),
            isActivated: user.dataValues.isActivated
        }
        const tokens = TokenService.generateTokens(userDto)
        await TokenService.saveRefreshToken(userDto.UUID, userDto.refreshUUID)

        return {...tokens, user: userDto}
    }

    static async refresh(refreshToken: string): Promise<IUserData> {
        if (!refreshToken) throw ApiError.UnauthorizedError(TokenExceptions.InvalidToken);
        const userData = TokenService.validateToken(refreshToken)
        if (!userData) throw ApiError.UnauthorizedError(TokenExceptions.InvalidToken);

        const tokenFromDB = await TokenService.findToken(userData?.refreshUUID)
        if (!tokenFromDB) throw ApiError.UnauthorizedError(TokenExceptions.InvalidToken);

        const user = await UserModel.findOne({where: {UUID: userData.UUID}})
        const userDto: IUserDto = {
            UUID: user?.dataValues.UUID,
            username: user?.dataValues.username,
            refreshUUID: uuidv4(),
            isActivated: user?.dataValues.isActivated
        }
        const tokens = TokenService.generateTokens({...userDto})
        await TokenService.saveRefreshToken(userDto.UUID, userDto.refreshUUID)

        return {...tokens, user: userDto}
    }

    static async logout(refreshToken: string): Promise<void> {
        await TokenService.removeToken(refreshToken);
    }
}


export default AuthService;