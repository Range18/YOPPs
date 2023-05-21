import {ApiError} from "../Errors/ApiErrors";

export const errorMiddleware = function (err: ApiError, req: any, res: any, next: any) {
    console.log(err)
    if (err instanceof ApiError) {
        return res.status(err.getStatus()).json({message: err.message, errors: err.getErrors()})
    }
    return res.status(500).json({message: 'Unexpected Error'})
}