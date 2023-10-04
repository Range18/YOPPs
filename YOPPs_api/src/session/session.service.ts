import { Sessions } from './session.model';
import TokenService from './token.service';
import { jwtSettings } from '../config';
import { logger } from '../main';
import { UserPayload } from '../user/types/user-payload';
import ms from 'ms';

export abstract class SessionService {
  static async create(
    UUID: string,
    refreshUUID: string,
  ): Promise<Sessions | null> {
    try {
      return await Sessions.create({
        userUUID: UUID,
        UUID: refreshUUID,
        expireAt: Date.now() + ms(jwtSettings.authExpires.refresh),
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
