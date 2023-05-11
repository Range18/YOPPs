import {UserModel} from "../models/userModel";
import {ApiError} from "../Errors/ApiErrors";
import {UserProfilePageModel} from "../models/UserProfilePageModel";
import {IUserPage} from "../Dto/pageDataPayload";
import {IUserDto} from "../Dto/IUserDto";


class UserPageService {
    async getUserPageData(userData: IUserDto) {
        console.log(userData)
        const userUUID = userData.UUID;
        const user = await UserModel.findOne({where: {UUID: userUUID}})
        if (!user) {
            throw ApiError.BadRequest('User and page not found')
        }
        const userPage= await UserProfilePageModel.findOne({where: {userUUID}})
        if (!userPage) {
            throw ApiError.BadRequest('User page not found')
        }

        const userPageData: IUserPage = {
            userData: {
                UUID: user.UUID,
                username: user.username,
                name: user.name,
                surname: user.surname,
                age: user.age,
                email:user.email,
                isActivated: user.isActivated
            },
            description: userPage.description,
            socialLinks: JSON.parse(userPage.socialLinks)
        }
        return userPageData
    }

    async saveUserPage(userPageData: IUserPage) {
        const currentPage = await UserProfilePageModel.findOne({where: {userUUID: userPageData.userData.UUID}})
        const user = await UserModel.findOne({where: {UUID: userPageData.userData.UUID}})
        if (!currentPage || !user) {
            throw ApiError.BadRequest('User and page not found')
        }
        await currentPage.update({
            description: userPageData.description,
            socialLinks: JSON.stringify(userPageData.socialLinks)
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

export default new UserPageService();