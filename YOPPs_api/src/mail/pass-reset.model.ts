import { dbContext } from '../dbController/database.controller';
import { DataTypes, Model } from 'sequelize';

export class PassResetModel extends Model {
  declare id: number;
  declare userUUID: string;
  declare code: string;
  declare expireAt: Date;
}

PassResetModel.init(
  {
    userUUID: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    code: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    expireAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    tableName: 'PWDResetCodes',
    createdAt: true,
    updatedAt: false,
    sequelize: dbContext,
  },
);
