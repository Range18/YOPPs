
import {IUser} from "./IUser";

export interface IAuthResponse{
    userData: IUserData,
    message: string

}

interface IUserData {
    accessToken: string,

    user: IUser
}