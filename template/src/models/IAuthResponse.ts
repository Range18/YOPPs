
import {IUser} from "./IUser";

export interface IAuthResponse{
    userData: IUserData,
    message: string

}

interface IUserData {
    refreshToken: string,
    accessToken: string,

    user: IUser
}