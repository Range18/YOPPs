import {DataTypes, Model} from "sequelize";
import {dbContext} from "../dbController/dbConnect";



export class FileModel extends Model {
    declare pageUUID: string;
    declare originalName: string;
    declare fileName: string;
    declare type: string;
    declare size: number;
}

FileModel.init({
    pageUUID:{
        type: DataTypes.UUID,
        allowNull: false
    },
    originalName:{
        type: DataTypes.STRING,
        allowNull: false
    },
    fileName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    type: {
        type: DataTypes.STRING,
        allowNull: false
    },
    size:{
        type: DataTypes.INTEGER,
        allowNull: false
    }
},{
    tableName: 'UserFiles',
    createdAt: true,
    updatedAt: true,
    sequelize: dbContext
})