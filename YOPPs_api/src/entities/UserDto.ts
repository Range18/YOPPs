import {UserData} from "./UserData";

export type UserDto = Pick<UserData, 'accessToken' | 'user'>
