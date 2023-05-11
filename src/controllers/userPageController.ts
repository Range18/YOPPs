import UserPageService from "../services/userPageService";
import {RequestHandler, Response} from "express";
import * as fs from "fs";


class UserPageController{
    async savePage(req:any,res:Response,next: any){
        try{
            const userPageData = req.body;
            const pageInfo =await UserPageService.saveUserPage(userPageData)
            return res.json({message: 'Saved', data: pageInfo})
        } catch (err){
            next(err)
        }
    }

    async getPageData(req:any,res:Response,next:any){
        try{
            const userData = req.body;
            const userPageData = await UserPageService.getUserPageData(userData)
            return res.json({data:userPageData})
        } catch (err){
            next(err)
        }
    }
}

export default new UserPageController();