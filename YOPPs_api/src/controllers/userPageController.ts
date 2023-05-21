import UserPageService from "../services/userPageService";
import {NextFunction, Request, Response} from "express";



class UserPageController {
    async savePage(req: Request, res: Response, next: NextFunction) {
        try {
            const userPageData = req.body;
            const pageInfo = await UserPageService.saveUserPage(userPageData)
            return res.status(201).json({message:'OK'})
        } catch (err) {
            next(err)
        }
    }

    async getPrivatePage(req: Request, res: Response, next: NextFunction) {
        try {
            const userData = req.body;
            const userPageData = await UserPageService.getPrivatePageData(userData)
            return res.json(userPageData)
        } catch (err) {
            next(err)
        }
    }

    async getPublicPage(req: Request, res: Response, next: NextFunction) {
        try {
            const username = req.params.username;
            const userPageData = await UserPageService.getPublicPageData(username)
            return res.json(userPageData)
        } catch (err) {
            next(err)
        }
    }
}

export default new UserPageController();