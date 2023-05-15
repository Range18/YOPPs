import UserPageService from "../services/userPageService";
import {RequestHandler, Response} from "express";
import * as fs from "fs";


class UserPageController {
    async savePage(req: any, res: Response, next: any) {
        try {
            const userPageData = req.body;
            const pageInfo = await UserPageService.saveUserPage(userPageData)
            return res.status(201)
        } catch (err) {
            next(err)
        }
    }

    async getPrivatePage(req: any, res: Response, next: any) {
        try {
            const userData = req.body;
            const userPageData = await UserPageService.getPrivatePageData(userData)
            return res.json({data: userPageData})
        } catch (err) {
            next(err)
        }
    }

    async getPublicPage(req: any, res: Response, next: any) {
        try {
            const username = req.params.username;
            const userPageData = await UserPageService.getPublicPageData(username)
            return res.json({data: userPageData})
        } catch (err) {
            next(err)
        }
    }
}

export default new UserPageController();