import {IUserDto} from "../Dto/IUserDto";


export interface IUserData {

    refreshToken: string;
    accessToken: string,
    user: IUserDto
}