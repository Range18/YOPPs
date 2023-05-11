import {DataTypes, Model} from "sequelize";
import {sequelize} from "../dbController/dbConnect";
import {UserModel} from "./userModel";


export class UserProfilePageModel extends Model {
    declare userUUID: string;
    declare description: string;
    declare socialLinks: string;
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
    socialLinks:{
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    tableName: 'userPages',
    sequelize
})





