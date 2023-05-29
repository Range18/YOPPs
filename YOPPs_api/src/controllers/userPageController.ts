import UserPageService from "../services/userPageService";
import {NextFunction, Request, Response} from "express";



class UserPageController {
    async savePage(req: Request, res: Response, next: NextFunction) {
        try {
            const userPageData = req.body;
            await UserPageService.saveUserPage(userPageData)
            return res.status(201).json({message:'OK'})
        } catch (err) {
            next(err)
        }
    }

    async getPage(req: Request, res: Response, next: NextFunction) {
        try {
            const username = req.params.username;
            const userPageData = await UserPageService.getPageData(username)
            return res.json(userPageData)
        } catch (err) {
            next(err)
        }
    }
}

export default new UserPageController();