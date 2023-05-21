import {DataTypes, Model} from "sequelize";
import {sequelize} from "../dbController/dbConnect";
import {UserModel} from "./userModel";


export class UserProfilePageModel extends Model {
    declare userUUID: string;
    declare description: string;
    declare contactEmail: string;
    declare socialLinks: string;
    declare avatarImage: string;
}

UserProfilePageModel.init({
    userUUID: {
        type: DataTypes.UUID,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    contactEmail:{
        type: DataTypes.STRING,
        allowNull: true,
    },
    socialLinks:{
        type: DataTypes.STRING,
        allowNull: true
    },
    avatarImage:{
        type: DataTypes.TEXT('medium'),
        allowNull:true,
    }
}, {
    tableName: 'userPages',
    sequelize
})





