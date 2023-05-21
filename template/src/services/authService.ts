
import {AxiosResponse} from 'axios'
import {IAuthResponse} from "../models/IAuthResponse";
import api from "../http";

export default class AuthService {
    static async registration(username: string, email: string, password: string): Promise<AxiosResponse<IAuthResponse>> {
        return api.post('/registration', {username, email, password})
    }

    static async login(email: string, password: string): Promise<AxiosResponse<IAuthResponse>> {
        return api.post('/login', {email, password})
    }

    static async logout(): Promise<void> {
        return api.delete('/logout')
    }
}