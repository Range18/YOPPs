import jwt, { JwtPayload } from 'jsonwebtoken';
import { jwtSettings } from '../config';
import { Token } from '../models/Token-model';
import { User } from '../Dto/User';
import { Logger } from '../logger/logger';

abstract class TokenService {
    static generateTokens(payload: User) {
        const refreshToken = jwt.sign(payload, jwtSettings.secret, {expiresIn: jwtSettings.authExpires.refresh})
        const accessToken = jwt.sign(payload, jwtSettings.secret, {expiresIn: jwtSettings.authExpires.access})

        return {refreshToken, accessToken}
    }


    static async saveRefreshToken(UUID: string, refreshUUID: string): Promise<Token | null> {
        try {
            //if u don`t want to create a new session, this code just updates existing
            // const tokenData: Token | null = await Token.findOne({where: {userUUID: UUID}})
            // if (tokenData) {
            //     tokenData.UUID = refreshUUID
            //     return await tokenData.save()
            // }
            const maxAgeRefreshToken = Number(jwtSettings.authExpires.refresh.slice(0, -1)) * 24 * 60 * 60 * 1000
            return await Token.create({
                userUUID: UUID,
                UUID: refreshUUID,
                expireIn: Date.now() + maxAgeRefreshToken
            })
        } catch (err) {
            Logger.log(err, 'ERROR')
            return null
        }
    }

    static async removeToken(token: string): Promise<void> {
        try {
            const tokenPayload = this.validateToken(token)
            await Token.destroy({where:{UUID: tokenPayload?.refreshUUID}})
        } catch (err) {
            Logger.log(err, 'ERROR')
        }
    }

    static async findToken(UUID: string | undefined): Promise<Token | null> {
        try {
            return await Token.findOne({ where: { UUID } });
        } catch (err) {
            Logger.log(err, 'ERROR')
            return null;
        }
    }


    static validateToken(token: string): User | null {
        try {
            const userData: string | User | JwtPayload = jwt.verify(token, jwtSettings.secret)
            return userData as User;
        } catch (err) {
            Logger.log(err, 'ERROR')
            return null;
        }
    }
}

export default TokenService;