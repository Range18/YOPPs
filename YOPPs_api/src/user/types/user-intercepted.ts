import { UserModel } from '../User-model';

export type UserIntercepted = Pick<
  UserModel,
  'UUID' | 'email' | 'username' | 'isActivated'
>;
