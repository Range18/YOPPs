import jwt, {Jwt, JwtPayload} from "jsonwebtoken";
import {jwtSettings} from "../../config";
import {Token} from "../models/Token-model";
import {IUserDto} from "../Dto/IUserDto";

class TokenService {
    static generateTokens(payload: IUserDto) {
        const refreshToken = jwt.sign(payload, jwtSettings.secret, {expiresIn: jwtSettings.authExpires.refresh})
        const accessToken = jwt.sign(payload, jwtSettings.secret, {expiresIn: jwtSettings.authExpires.access})

        return {refreshToken, accessToken}
    }

    static generateActivationToken(payload: IUserDto): string {
        const token = jwt.sign(payload, jwtSettings.secret)
        return token
    }

    static async saveRefreshToken(UUID: string, refreshUUID: string): Promise<Token | null> {
        try {
            const tokenData: Token | null = await Token.findOne({where: {UUID}})
            if (tokenData) {
                tokenData.UUID = refreshUUID
                return tokenData.save()
            }
            const maxAgeRefreshToken = Number(jwtSettings.authExpires.refresh.slice(0, -1)) * 24 * 60 * 60 * 1000
            const token = await Token.create({
                userUUID: UUID,
                UUID: refreshUUID,
                expireIn: Date.now() + maxAgeRefreshToken
            })
            return token
        } catch (err) {
            console.log(err)
            return null
        }
    }

    static async removeToken(token: string): Promise<Token | null> {
        try {
            const tokenPayload = this.validateToken(token)
            const tokenData = await Token.findOne({where: {UUID: tokenPayload?.refreshUUID}})
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

    static async findToken(UUID: string | undefined): Promise<Token | null> {
        try {
            const tokenData: Token | null = await Token.findOne({where: {UUID}})
            return tokenData;
        } catch (err) {
            console.log(err)
            return null;
        }
    }


    static validateToken(token: string): IUserDto | null {
        try {
            const userData: string | IUserDto | JwtPayload = jwt.verify(token, jwtSettings.secret)
            return userData as IUserDto;
        } catch (err) {
            console.log(err)
            return null;
        }
    }
}

export default TokenService;