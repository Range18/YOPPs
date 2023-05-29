import {IUserData} from "./IUserData";

export type PartialUserData = Pick<IUserData, 'accessToken' | 'user'>
