import {DataTypes, Model} from "sequelize";
import {sequelize} from "../dbController/dbConnect";



export class Token extends Model {
    declare UUID: string;
    declare token: string;
}

Token.init({
    UUID: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    token: {
        type: DataTypes.TEXT,
        allowNull: false,
    }
}, {
    tableName: 'refreshTokens',
    sequelize
})