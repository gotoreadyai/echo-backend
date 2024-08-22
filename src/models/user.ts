import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../db"; // Upewnij się, że ścieżka do instancji Sequelize jest poprawna

interface UserAttributes {
  id: string;
  email: string;
  password: string;
  role: "teacher" | "student" | "admin"; // Możesz dodać więcej ról w zależności od potrzeb
  createdAt?: Date;
  updatedAt?: Date;
}

interface UserCreationAttributes
  extends Optional<UserAttributes, "id" | "createdAt" | "updatedAt"> {}

class User
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes
{
  public id!: string;
  public email!: string;
  public password!: string;
  public role!: "teacher" | "student" | "admin"; // Możesz dodać się, które ról jest poprawny/ Domyślna rola użytkownika

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM("teacher", "student", "admin"),
      allowNull: false,
      defaultValue: "student",
    },
  },
  {
    sequelize,
    modelName: "User",
    timestamps: true, // Automatycznie dodaje createdAt i updatedAt
  }
);

export default User;
