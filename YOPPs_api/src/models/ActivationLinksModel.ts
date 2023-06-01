import {DataTypes, Model} from "sequelize";
import {dbContext} from "../dbController/dbConnect";


export class ActivationLinksModel extends Model {
    declare  id: number;
    declare userUUID: string;
    declare linkCode: string;
}

ActivationLinksModel.init({
    userUUID:{
        type: DataTypes.UUID,
        allowNull: false
    },
    linkCode:{
        type: DataTypes.UUID,
        allowNull: false
    }
},{
    tableName: 'ActivationLinks',
    createdAt: true,
    updatedAt: false,
    sequelize: dbContext,
})