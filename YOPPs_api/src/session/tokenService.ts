import { jwtSettings } from '../config';
import { UserPayload } from '../user/user-payload';
import { logger } from '../main';
import jwt from 'jsonwebtoken';

abstract class TokenService {
  static generate(payload: UserPayload) {
    const refreshToken = jwt.sign(payload, jwtSettings.secret, {
      expiresIn: jwtSettings.authExpires.refresh,
    });
    const accessToken = jwt.sign(payload, jwtSettings.secret, {
      expiresIn: jwtSettings.authExpires.access,
    });

    return { refreshToken, accessToken };
  }

  static validate<T extends object>(token: string): T {
    try {
      return jwt.verify(token, jwtSettings.secret) as T;
    } catch (err) {
      logger.error(err);
      return null;
    }
  }
}

export default TokenService;
