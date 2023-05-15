import {ApiError} from "../Errors/ApiErrors";
import TokenService from "../services/tokenService";
import {IUserDto} from "../Dto/IUserDto";

export async function authorizedAndActivated (req: any, res: any, next: any) {
    try {
        const accessToken = req.headers.authorization.split(' ')[1]
        if(!accessToken){
            return  next(ApiError.UnauthorizedError('No accessToken'))
        }
        const userData: IUserDto | null = TokenService.validateToken(accessToken)
        if(!userData){
            return next(ApiError.UnauthorizedError())
        }
        if(!userData.isActivated){
            return next(ApiError.Forbidden(('Account is not activated')))
        }
        req.user = userData
        next()
    } catch (err){
        return next(ApiError.UnauthorizedError())
    }
}