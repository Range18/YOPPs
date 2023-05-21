import {IUser} from "../entities/IUser";
import {ILinks} from "../entities/ILinks";

export interface IUserPage {
    userData: IUser;
    description: string;
    contactEmail: string;
    socialLinks: ILinks;
    avatarImg: string;
}


