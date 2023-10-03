import { UserData } from '../types/user-data';

export type UserDto = Pick<UserData, 'accessToken' | 'user'>;
