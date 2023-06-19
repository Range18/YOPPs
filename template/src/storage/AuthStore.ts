import { makeAutoObservable } from "mobx";
import { IUser } from "../models/IUser";
import AuthService from "../services/authService";
import axios from "axios";
import { IAuthResponse } from "../models/IAuthResponse";
import { apiServer } from "../configTemplate";
import { UserService } from "../services/userService";
import { IPageResponse } from "../models/IPageResponse";
import { buffer } from "stream/consumers";

export default class AuthStore {
  userPage: IPageResponse = { userData: {}, socialLinks: {} } as IPageResponse;
  user: IUser = {} as IUser;
  isAuth: boolean = false;

  constructor() {
    makeAutoObservable(this);
  }

  setUser(user: IUser) {
    this.user = user;
  }

  setAuth(bool: boolean) {
    this.isAuth = bool;
  }

  setPage(page: IPageResponse) {
    this.userPage = page;
  }

  async registration(username: string, email: string, password: string) {
    try {
      const response = await AuthService.registration(
        username,
        email,
        password
      );
      console.log(response);
      localStorage.setItem("accessToken", response.data.userData.accessToken);
      this.setUser(response.data.userData.user);
      this.setAuth(true);
    } catch (err) {
      console.log(err);
    }
  }

  async login(email: string, password: string) {
    try {
      const response = await AuthService.login(email, password);
      console.log(response);
      localStorage.setItem("accessToken", response.data.userData.accessToken);
      this.setUser(response.data.userData.user);
      this.setAuth(true);
    } catch (err) {
      console.log(err);
    }
  }

  async logout() {
    try {
      const response = await AuthService.logout();
      localStorage.removeItem("accessToken");
      this.setAuth(false);
      this.setUser({} as IUser);
    } catch (err) {
      console.log(err);
    }
  }

  async checkAuth() {
    try {
      const response = await axios.get<IAuthResponse>(
        `${apiServer.url}/refresh`,
        { withCredentials: true }
      );
      console.log(response);
      localStorage.setItem("AccessToken", response.data.userData.accessToken);
      this.setAuth(true);
      this.setUser(response.data.userData.user);
    } catch (err) {
      console.log(err);
    }
  }

  async getUserPage(username: string) {
    try {
      const response = await UserService.getUserPage(username);
      console.log(response);
      this.setPage(response.data);
    } catch (err) {
      console.log(err);
    }
  }
}
