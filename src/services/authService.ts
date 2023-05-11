import bcrypt from 'bcryptjs'

import {UserModel} from "../models/userModel";
import {ApiError} from "../Errors/ApiErrors";
import {apiServer, bcryptSalt} from "../../config";

import MailService from "./mailService";
import TokenService from "./tokenService";
import {UserProfilePageModel} from "../models/UserProfilePageModel";
import {IUserDto} from "../Dto/IUserDto";

class AuthService {
    async registration(username: string, email: string, password: string) {
        const candidate: UserModel | null = await UserModel.findOne({where: {email}})
        if (candidate) {
            throw ApiError.BadRequest(`That user with ${email} is already exits`)
        }

        const hashPassword = bcrypt.hashSync(password, bcryptSalt);
        const user: UserModel = await UserModel.create({
            username,
            email,
            password: hashPassword,
        })
        await UserProfilePageModel.create({userUUID: user.UUID})
        const userDto: IUserDto = {
            UUID: user.UUID,
            username: user.username,
            isActivated: user.isActivated
        }
        console.log(userDto)
        const activationLink: string = TokenService.generateActivationToken(userDto)

        await MailService.sendActivationMail(email, `${apiServer.url}/api/auth/activate/${activationLink}`)

        const tokens = TokenService.generateTokens(userDto)
        await TokenService.saveRefreshToken(userDto.UUID, tokens.refreshToken)

        return {...tokens, user: userDto}
    }

    async activate(token: string) {
        const tokenData = TokenService.validateToken(token)
        if (!tokenData) {
            throw ApiError.BadRequest('Invalid activation token')
        }
        const UUID = tokenData.UUID
        const user = await UserModel.findOne({where: {UUID}})
        if (!user) {
            throw ApiError.BadRequest('Invalid activation URL')
        }
        user.isActivated = true
        await user.save()
    }

    async login(email: string, password: string) {
        const user = await UserModel.findOne({where: {email}})
        if (!user) {
            throw ApiError.BadRequest(`User ${email} not found`)
        }
        const isPassEquals = await bcrypt.compare(password, user.password)
        if (!isPassEquals) {
            throw ApiError.BadRequest(`Invalid password`)
        }
        const userDto: IUserDto = {
            UUID: user.dataValues.UUID,
            username: user.dataValues.username,
            isActivated: user.dataValues.isActivated
        }
        const tokens = TokenService.generateTokens(userDto)
        await TokenService.saveRefreshToken(userDto.UUID, tokens.refreshToken)

        return {...tokens, user: userDto}
    }

    async refresh(refreshToken: string) {
        if (!refreshToken) {
            throw ApiError.UnauthorizedError()
        }
        const userData = TokenService.validateToken(refreshToken)
        const tokenFromDB = await TokenService.findToken(refreshToken)
        if (!userData || !tokenFromDB) {
            throw ApiError.UnauthorizedError()
        }
        const user = await UserModel.findOne({where: {UUID: userData.UUID}})
        const userDto: IUserDto = {
            UUID: user?.dataValues.UUID,
            username: user?.dataValues.username,
            isActivated: user?.dataValues.isActivated
        }
        const tokens = TokenService.generateTokens({...userDto})
        await TokenService.saveRefreshToken(userDto.UUID, tokens.refreshToken)

        return {...tokens, user: userDto}
    }

    async logout(refreshToken: string) {
        const token = await TokenService.removeToken(refreshToken)
        return token;
    }
}


export default new AuthService();