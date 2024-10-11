import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../db";
import Workspace from "./workspace";
import User from "./user";

interface PermissionAttributes {
  id: string;
  onlyYours: boolean;
  canCreate: boolean;
  canUpdate: boolean;
  canDelete: boolean;
  canRead: boolean;
  role: "admin" | "user" | "teacher" | "student";
  workspaceId: string;
  ownerId: string;
}

interface PermissionCreationAttributes
  extends Optional<PermissionAttributes, "id"> {}

class Permission
  extends Model<PermissionAttributes, PermissionCreationAttributes>
  implements PermissionAttributes
{
  public id!: string;
  public onlyYours!: boolean;
  public canCreate!: boolean;
  public canUpdate!: boolean;
  public canDelete!: boolean;
  public canRead!: boolean;
  public role!: "admin" | "user" | "teacher" | "student";
  public workspaceId!: string;
  public ownerId!: string;
  public static include = {
    model: Workspace,
    attributes: ["id", "title", "slug"],
  };
}

Permission.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    onlyYours: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    canCreate: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    canUpdate: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    canDelete: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    canRead: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM("admin", "user", "teacher", "student"),
      allowNull: false,
    },
    workspaceId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "Workspaces",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    ownerId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Permission",
  }
);

// Relacja z modelem User
Permission.belongsTo(User, { foreignKey: "ownerId", as: "owner" });

// Poprawione relacje
Permission.belongsTo(Workspace, { foreignKey: "workspaceId" });
Workspace.hasMany(Permission, { foreignKey: "workspaceId" });

export default Permission;

export const include = {
  model: Workspace,
};
