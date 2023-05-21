import api from "../http";
import {AxiosResponse} from "axios";
import {IPageResponse} from "../models/IPageResponse";


export class UserService {
    static async getPublicUserPage(username: string): Promise<AxiosResponse<IPageResponse>> {
        return  api.get<IPageResponse>(`userPage/get/public/${username}`)
    }
}