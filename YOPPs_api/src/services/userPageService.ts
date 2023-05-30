import { UserModel } from '../models/userModel';
import { ApiError } from '../Errors/ApiErrors';
import { UserProfilePageModel } from '../models/UserProfilePageModel';
import { IUserPage } from '../Dto/pageDataDto';
import { AuthExceptions, UserPageExceptions } from '../Errors/HttpExceptionsMessages';


class UserPageService {

    static async getPageData(username: string): Promise<IUserPage>{
        const user = await UserModel.findOne({where:{username}})
        if(!user){
            throw ApiError.NotFound(AuthExceptions.UserNotFound)
        }
        const userPage = await UserProfilePageModel.findOne({where: {userUUID: user.UUID}})
        if (!userPage) {
            throw ApiError.NotFound(UserPageExceptions.ImgNotFound)
        }
        return {
            userData: {
                UUID: user.UUID,
                username: user.username,
                name: user.name,
                surname: user.surname,
                age: user.age,
            },
            description: userPage.description,
            socialLinks: JSON.parse(userPage.socialLinks),
            contactEmail: userPage.contactEmail,
        }
    }

    static async saveUserPage(userPageData: IUserPage): Promise<IUserPage> {
        const currentPage = await UserProfilePageModel.findOne({where: {userUUID: userPageData.userData.UUID}})
        const user = await UserModel.findOne({where: {UUID: userPageData.userData.UUID}})
        if (!currentPage || !user) {
            throw ApiError.NotFound(UserPageExceptions.PageNotFound)
        }
        await currentPage.update({
            description: userPageData.description,
            socialLinks: JSON.stringify(userPageData.socialLinks),
            contactEmail: userPageData.contactEmail,
        })
        await user.update({
            username: userPageData.userData.username,
            name: userPageData.userData.name,
            surname: userPageData.userData.surname,
            age: userPageData.userData.age,
        })

        return userPageData
    }
}

export default UserPageService;