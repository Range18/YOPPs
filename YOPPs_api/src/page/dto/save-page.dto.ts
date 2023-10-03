import { GetUserRdo } from '../../user/dto/get-user.rdo';
import { Links } from '../links.type';

export class SavePageDto {
  userData: Omit<GetUserRdo, 'UUID'>;
  description?: string;
  contactEmail?: string;
  socialLinks?: Links;
}
