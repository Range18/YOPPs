import { Links } from '../links.type';
import { GetUserRdo } from '../../user/dto/get-user.rdo';

export class GetPageRdo {
  userData: GetUserRdo;
  description?: string;
  contactEmail?: string;
  socialLinks?: Links;
}
