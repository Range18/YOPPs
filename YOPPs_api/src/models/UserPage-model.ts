import { FileModel } from './File-model';
import { dbContext } from '../dbController/database.controller';
import { DataTypes, Model } from 'sequelize';

export class UserPageModel extends Model {
  declare userUUID: string;
  declare description: string;
  declare contactEmail: string;
  declare socialLinks: string;
  declare avatarId: number;
}

UserPageModel.init(
  {
    userUUID: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    contactEmail: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    socialLinks: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    avatarId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    tableName: 'userPages',
    sequelize: dbContext,
  },
);

UserPageModel.hasMany(FileModel, {
  foreignKey: 'id',
});
