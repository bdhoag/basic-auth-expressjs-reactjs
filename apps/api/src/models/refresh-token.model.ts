import { DataTypes, Model, Optional } from "sequelize"
import { sequelize } from "../config/db.config"

interface RefreshTokenAttributes {
  id: string
  token: string
  userId: string
  expiresAt: Date
  createdAt?: Date
  updatedAt?: Date
}

type RefreshTokenCreationAttributes = Optional<RefreshTokenAttributes, "id">

class RefreshToken
  extends Model<RefreshTokenAttributes, RefreshTokenCreationAttributes>
  implements RefreshTokenAttributes
{
  declare id: string
  declare token: string
  declare userId: string
  declare expiresAt: Date
  declare readonly createdAt: Date
  declare readonly updatedAt: Date
}

RefreshToken.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    token: {
      type: DataTypes.STRING(512),
      allowNull: false,
      unique: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  { sequelize, modelName: "RefreshToken" }
)

export default RefreshToken
