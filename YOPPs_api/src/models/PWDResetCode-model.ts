import { DataTypes, Model } from 'sequelize';
import { dbContext } from '../dbController/database.controller';


export class PWDResetCodeModel extends Model {
    declare id: number;
    declare userUUID: string;
    declare code: string;
    declare expireIn: string;
}

PWDResetCodeModel.init({
    userUUID: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    code: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    expireIn: {
        type: DataTypes.DATE,
        allowNull: false,
    },
}, {
    tableName: 'PWDResetCodes',
    createdAt: true,
    updatedAt: false,
    sequelize: dbContext,
});