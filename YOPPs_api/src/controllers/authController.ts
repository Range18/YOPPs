import AuthService from "../services/authService";
import {clientServer, jwtSettings} from "../../config";
import {NextFunction, Request, Response} from "express";
import {PartialUserData} from "../entities/PartialUserData";

class AuthController {
    private static maxAgeRefreshToken = Number(jwtSettings.authExpires.refresh.slice(0, -1)) * 24 * 60 * 60 * 1000


    async registration(req: Request, res: Response, next: NextFunction) {
        try {
            const {username, email, password} = req.body;
            const userData = await AuthService.registration(username, email, password)

            res.cookie('refreshToken', userData.refreshToken, {maxAge: AuthController.maxAgeRefreshToken, httpOnly: true})
            const userDataPreview: PartialUserData = {
                accessToken: userData.accessToken,
                user: userData.user
            }
            return res.status(201).json({userDataPreview, message: "OK"});
        } catch (err) {
            next(err)
        }
    }

    async login(req: Request, res: Response, next: NextFunction) {
        try {
            const {email, password} = req.body;
            const userData = await AuthService.login(email, password)

            res.cookie('refreshToken', userData.refreshToken, {maxAge: AuthController.maxAgeRefreshToken, httpOnly: true})
            const userDataPreview: PartialUserData = {
                accessToken: userData.accessToken,
                user: userData.user
            }
            return res.status(201).json({userDataPreview, message: "OK"});
        } catch (err) {
            next(err)
        }
    }

    async logout(req: Request, res: Response, next: NextFunction) {
        try {
            const {refreshToken} = req.cookies
            const token = await AuthService.logout(refreshToken)
            res.clearCookie('refreshToken')
            return res.json({message: 'OK'})
        } catch (err) {
            next(err)
        }
    }

    async refresh(req: Request, res: Response, next: NextFunction) {
        try {
            const {refreshToken} = req.cookies
            const userData = await AuthService.refresh(refreshToken)

            res.cookie('refreshToken', userData.refreshToken, {maxAge: AuthController.maxAgeRefreshToken, httpOnly: true})
            const userDataPreview: PartialUserData = {
                accessToken: userData.accessToken,
                user: userData.user
            }
            return res.json({userDataPreview, message: "OK"});
        } catch (err) {
            next(err)
        }
    }

    async activate(req: Request, res: Response, next: NextFunction) {
        try {
            const token = req.params.link
            await AuthService.activate(token)
            return res.redirect(clientServer.url)
        } catch (err) {
            next(err)
        }
    }
}

export default new AuthController();