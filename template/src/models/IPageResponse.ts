import { IUser } from "./IUser";

export interface IPageResponse {
  userData: IUser;
  description?: string;
  contactEmail?: string;
  socialLinks?: ILinks;
}

interface ILinks {
  discord?: string;
  telegram?: string;
  vkontakte?: string;
  github?: string;
}
