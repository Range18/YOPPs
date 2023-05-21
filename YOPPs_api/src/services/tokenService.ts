import jwt, {Jwt, JwtPayload} from "jsonwebtoken";
import {jwtSettings} from "../../config";
import {Token} from "../models/Token-model";
import {IUserDto} from "../Dto/IUserDto";


class TokenService {
    generateTokens(payload: IUserDto ) {
        const refreshToken = jwt.sign(payload, jwtSettings.secret, {expiresIn: jwtSettings.authExpires.refresh})
        const accessToken = jwt.sign(payload, jwtSettings.secret, {expiresIn: jwtSettings.authExpires.access})

        return {refreshToken, accessToken}
    }

    generateActivationToken(payload: IUserDto) {
        const token = jwt.sign(payload, jwtSettings.secret, {expiresIn: jwtSettings.authExpires.activation})
        return token
    }

    async saveRefreshToken(UUID: string, refreshToken: string) {
        try {
            const tokenData: Token | null = await Token.findOne({where: {UUID}})
            if (tokenData) {
                tokenData.token = refreshToken
                return tokenData.save()
            }
            const token = await Token.create({UUID, token: refreshToken})
            return token
        } catch (err) {
            console.log(err)
            return null
        }
    }

    async removeToken(token: string) {
        try {
            //TODO There is an Error with undefined
            const tokenData = await Token.findOne({where: {token}})
            if (!tokenData) {
                return null;
            }
            await tokenData.destroy()
            return tokenData;
        } catch (err) {
            console.log(err)
            return null;
        }
    }

    async findToken( token: string) {
        try {
            const tokenData = await Token.findOne({where: {token}})
            return tokenData;
        } catch (err) {
            console.log(err)
            return null;
        }
    }


    validateToken(token: string){
        try {
            const userData: string | JwtPayload = jwt.verify(token, jwtSettings.secret)
            return userData as IUserDto;
        } catch (err) {
            console.log(err)
            return null;
        }
    }
}

export default new TokenService();