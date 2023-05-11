import {IUserDto} from "./IUserDto";
import {IUser} from "./IUser";

export interface IUserPage {
    userData: IUser;
    description: string;
    socialLinks: ILinks;
}


interface ILinks {
    discord?: string;
    telegram?: string;
    vkontakte?: string;
    github?: string;
}