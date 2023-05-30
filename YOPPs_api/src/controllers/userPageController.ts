import UserPageService from "../services/userPageService";
import {NextFunction, Request, Response} from "express";



abstract class UserPageController {
    static async savePage(req: Request, res: Response, next: NextFunction) {
        try {
            const userPageData = req.body;
            await UserPageService.saveUserPage(userPageData)
            return res.status(201).json({message:'OK'})
        } catch (err) {
            next(err)
        }
    }

    static async getPage(req: Request, res: Response, next: NextFunction) {
        try {
            const {usernameOrUUID} = req.params;
            const userPageData = await UserPageService.getPageData(usernameOrUUID)
            return res.json(userPageData)
        } catch (err) {
            next(err)
        }
    }
}

export default UserPageController;