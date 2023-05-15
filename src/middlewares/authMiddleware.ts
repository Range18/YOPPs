import {ApiError} from "../Errors/ApiErrors";
import TokenService from "../services/tokenService";
import {IUserDto} from "../Dto/IUserDto";

export async function authMiddleware (req: any, res: any, next: any) {
    try {
        const accessToken = req.headers.authorization.split(' ')[1]
        if(!accessToken){
            return  next(ApiError.UnauthorizedError('No authToken'))
        }
        const userData: IUserDto | null = TokenService.validateToken(accessToken)
        if(!userData){
            return next(ApiError.UnauthorizedError())
        }
        req.user = userData
        next()
    } catch (err){
       return next(ApiError.UnauthorizedError())
    }
}