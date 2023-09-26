import { GetUserRdo } from './GetUserRdo';
import { Links } from '../entities/Links';

export class GetPageRdo {
  userData: GetUserRdo;
  description?: string;
  contactEmail?: string;
  socialLinks?: Links;
}
