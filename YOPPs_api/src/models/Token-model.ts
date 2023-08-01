import {DataTypes, Model} from "sequelize";
import { dbContext } from '../dbController/database.controller';





export class Token extends Model {
    declare userUUID: string;
    declare UUID: string;
    declare expireIn: string;
}

Token.init({
    userUUID: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    UUID: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    expireIn:{
        type: DataTypes.DATE,
        allowNull: false
    }
}, {
    tableName: 'refreshTokens',
    createdAt: true,
    updatedAt: false,
    sequelize: dbContext
})

