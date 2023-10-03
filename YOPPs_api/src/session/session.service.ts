import { Sessions } from './session.model';
import TokenService from './tokenService';
import { jwtSettings } from '../config';
import { logger } from '../main';
import { UserPayload } from '../user/types/user-payload';

export abstract class SessionService {
  static async create(
    UUID: string,
    refreshUUID: string,
  ): Promise<Sessions | null> {
    try {
      const maxAgeRefreshToken =
        Number(jwtSettings.authExpires.refresh.slice(0, -1)) *
        24 *
        60 *
        60 *
        1000;
      return await Sessions.create({
        userUUID: UUID,
        UUID: refreshUUID,
        expireAt: Date.now() + maxAgeRefreshToken,
      });
    } catch (err) {
      logger.error(err);
      return null;
    }
  }

  static async find(UUID: string | undefined): Promise<Sessions | null> {
    try {
      return await Sessions.findOne({ where: { UUID } });
    } catch (err) {
      logger.error(err);
      return null;
    }
  }

  static async remove(token: string): Promise<void> {
    try {
      const tokenPayload = TokenService.validate<UserPayload>(token);
      await Sessions.destroy({ where: { UUID: tokenPayload?.refreshUUID } });
    } catch (err) {
      logger.error(err);
    }
  }
}
