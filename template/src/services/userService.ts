import api from "../http";
import { AxiosResponse } from "axios";
import { IPageResponse } from "../models/IPageResponse";

export class UserService {
  static async getUserPage(
    username: string
  ): Promise<AxiosResponse<IPageResponse>> {
    return api.get<IPageResponse>(`userPage/get/${username}`);
  }

  static async getAvatar(usernameOrUUID: string): Promise<any> {
    return api.get(`userPage/get/assets/avatar/${usernameOrUUID}`);
  }
}
