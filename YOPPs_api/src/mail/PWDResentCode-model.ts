import { dbContext } from '../dbController/database.controller';
import { DataTypes, Model } from 'sequelize';

export class PWDResentCodeModel extends Model {
  declare id: number;
  declare userUUID: string;
  declare code: string;
  declare expireAt: Date;
}

PWDResentCodeModel.init(
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
    sequelize: dbContext,
    createdAt: true,
    updatedAt: false,
    tableName: 'PWDResentCodes',
  },
);
