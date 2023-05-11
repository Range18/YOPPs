import {CreateOptions, DataTypes, Model, UUID} from "sequelize";
import {sequelize} from "../dbController/dbConnect";
import {UserProfilePageModel} from "./UserProfilePageModel";
import {Token} from "./Token-model";
import {HookReturn} from "sequelize/types/hooks";


export class UserModel extends Model {
    declare id: number;
    declare UUID : string;
    declare username: string;
    declare email: string;
    declare name: string;
    declare surname: string;
    declare age: string;
    declare password: string;
    declare isActivated: boolean;
}


UserModel.init({
    UUID:{
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true
    },
    username:{
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
    },
    email:{
        type: DataTypes.STRING,
        unique: true,
        allowNull:false,
    },
    name:{
      type: DataTypes.STRING,
        defaultValue: '',
        allowNull: true
    },
    surname: {
      type: DataTypes.STRING,
        defaultValue: '',
        allowNull: true
    },
    age: {
      type: DataTypes.STRING,
        defaultValue: '',
        allowNull: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isActivated:{
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
    }
}, {
    tableName: 'users',
    createdAt: true,
    updatedAt: true,
    sequelize,
})

UserModel.hasOne(UserProfilePageModel, {
    foreignKey: 'userUUID',
})

UserProfilePageModel.belongsTo(UserModel, {
    foreignKey: 'userUUID',
})



