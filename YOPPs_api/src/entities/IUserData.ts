import {UserDto} from "../Dto/UserDto";


export interface IUserData {
    refreshToken: string;
    accessToken: string,
    user: UserDto
}