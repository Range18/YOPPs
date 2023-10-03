import { dbContext } from '../dbController/database.controller';
import { DataTypes, Model } from 'sequelize';

export class Sessions extends Model {
  declare userUUID: string;
  declare UUID: string;
  declare expireIn: string;
}

Sessions.init(
  {
    userUUID: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    UUID: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    expireAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    tableName: 'sessions',
    createdAt: true,
    updatedAt: false,
    sequelize: dbContext,
  },
);
