import {IUserDto} from "./IUserDto";
import {IUser} from "./IUser";

export interface IUserPage {
    userData: IUser;
    description: string;
    contactEmail: string;
    socialLinks: ILinks;
    avatarImg: string;
}


interface ILinks {
    discord?: string;
    telegram?: string;
    vkontakte?: string;
    github?: string;
}