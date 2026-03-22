import { DataTypes, Model, Optional } from "sequelize"
import { sequelize } from "../config/db.config"

interface UserAttributes {
  id: string
  name: string
  email: string
  passwordHash: string
  createdAt?: Date
  updatedAt?: Date
}

type UserCreationAttributes = Optional<UserAttributes, "id">

class User
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes
{
  declare id: string
  declare name: string
  declare email: string
  declare passwordHash: string
  declare readonly createdAt: Date
  declare readonly updatedAt: Date
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: "Name is required" },
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: { msg: "Must be a valid email address" },
        notEmpty: { msg: "Email is required" },
      },
    },
    passwordHash: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  { sequelize, modelName: "User" }
)

export default User
