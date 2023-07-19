import {DataTypes, Model} from "sequelize";
import {dbContext} from "../dbController/dbConnect";

export class PWDResentCodeModel extends Model{
    declare id: number;
    declare userUUID: string;
    declare code: string;
    declare expiredIn: string;
}

PWDResentCodeModel.init({
    userUUID: {
        type: DataTypes.UUID,
        allowNull: false
    },
    code: {
        type: DataTypes.UUID,
        allowNull: false
    },
    expiredIn:{
        type: DataTypes.DATE,
        allowNull: false
    }
}, {
    sequelize: dbContext,
    createdAt: true,
    updatedAt: false,
    tableName: 'PWDResentCodes'
})