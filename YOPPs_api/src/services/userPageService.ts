import {UserModel} from "../models/userModel";
import {ApiError} from "../Errors/ApiErrors";
import {UserProfilePageModel} from "../models/UserProfilePageModel";
import {IUserPage} from "../Dto/pageDataPayload";
import {IUserDto} from "../Dto/IUserDto";


class UserPageService {
    async getPrivatePageData(userData: IUserDto): Promise<IUserPage> {

        const userUUID = userData.UUID;
        const user = await UserModel.findOne({where: {UUID: userUUID}})
        if (!user) {
            throw ApiError.NotFound('User and page not found')
        }
        const userPage= await UserProfilePageModel.findOne({where: {userUUID}})
        if (!userPage) {
            throw ApiError.NotFound('User page not found')
        }

        const userPageData: IUserPage = {
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
            avatarImg: userPage.avatarImage
        }
        return userPageData
    }

    async getPublicPageData(username: string): Promise<IUserPage>{
        const user = await UserModel.findOne({where:{username}})
        if(!user){
            throw ApiError.NotFound('User not found')
        }
        const userPage = await UserProfilePageModel.findOne({where: {userUUID: user.UUID}})
        if (!userPage) {
            throw ApiError.NotFound('User page not found')
        }
        const userPageData: IUserPage = {
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
            avatarImg: userPage.avatarImage
        }
        return userPageData
    }

    async saveUserPage(userPageData: IUserPage): Promise<IUserPage> {
        const currentPage = await UserProfilePageModel.findOne({where: {userUUID: userPageData.userData.UUID}})
        const user = await UserModel.findOne({where: {UUID: userPageData.userData.UUID}})
        if (!currentPage || !user) {
            throw ApiError.NotFound('User and page not found')
        }
        await currentPage.update({
            description: userPageData.description,
            socialLinks: JSON.stringify(userPageData.socialLinks),
            contactEmail: userPageData.contactEmail,
            avatarImage: userPageData.avatarImg
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