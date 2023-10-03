import { UserData } from './user-data';

export type UserDto = Pick<UserData, 'accessToken' | 'user'>;
