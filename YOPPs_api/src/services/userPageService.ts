import { UserModel } from '../models/User-model';
import { ApiError } from '../Errors/ApiErrors';
import { UserPageModel } from '../models/UserPage-model';
import { GetPageDto } from '../Dto/GetPageDto';
import { AuthExceptions, UserPageExceptions } from '../Errors/HttpExceptionsMessages';
import { Op } from 'sequelize';
import StorageService from './storageService';


abstract class UserPageService {
    static async getPage(usernameOrUUID: string): Promise<UserPageModel | null> {
        return await UserPageModel.findOne({
            where: {
                [Op.or]: [
                    { userUUID: usernameOrUUID },
                    { userUUID: (await UserModel.findOne({ where: { username: usernameOrUUID } }))?.UUID ?? null },
                ],
            },
        });
    }

    static async getPageData(usernameOrUUID: string): Promise<GetPageDto> {
        const user = await UserModel.findOne({
            where: {
                [Op.or]: [
                    { UUID: usernameOrUUID },
                    { username: usernameOrUUID },
                ],
            },
        });
        if (!user) throw ApiError.NotFound(AuthExceptions.UserNotFound);

        const userPage = await UserPageModel.findOne({ where: { userUUID: user.UUID } });
        if (!userPage) throw ApiError.NotFound(UserPageExceptions.ImgNotFound);
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
        };
    }

    static async saveUserPage(userPageData: GetPageDto): Promise<GetPageDto> {
        const currentPage = await UserPageModel.findOne({ where: { userUUID: userPageData.userData.UUID } });
        const user = await UserModel.findOne({ where: { UUID: userPageData.userData.UUID } });
        if (!currentPage || !user) throw ApiError.NotFound(UserPageExceptions.PageNotFound);

        await currentPage.update({
            description: userPageData.description,
            socialLinks: JSON.stringify(userPageData.socialLinks),
            contactEmail: userPageData.contactEmail,
        });
        await user.update({
            username: userPageData.userData.username,
            name: userPageData.userData.name,
            surname: userPageData.userData.surname,
            age: userPageData.userData.age,
        });

        return userPageData;
    }
}

export default UserPageService;