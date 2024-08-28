import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../db";
import Workspace from "./workspace";
import User from "./user";

interface DocumentAttributes {
  id: string;
  title: string;
  content: Record<string, any>;
  workspaceId: string;
  ownerId: string;
}

interface DocumentCreationAttributes
  extends Optional<DocumentAttributes, "id"> {}

class Document
  extends Model<DocumentAttributes, DocumentCreationAttributes>
  implements DocumentAttributes
{
  public id!: string;
  public title!: string;
  public content!: Record<string, any>;
  public workspaceId!: string;
  public ownerId!: string;
}

Document.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    content: {
      type: DataTypes.JSONB,
      defaultValue: {},
      allowNull: false,
    },
    workspaceId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "Workspaces", // Nazwa tabeli do której odnosi się klucz obcy
        key: "id",
      },
      onDelete: "CASCADE", // Opcjonalnie: co zrobić, gdy workspace jest usuwany
    },
    ownerId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Document",
  }
);

// Relacja z modelem User
Document.belongsTo(User, { foreignKey: "ownerId", as: "owner" });

// Poprawione relacje
Workspace.hasMany(Document, { foreignKey: "workspaceId" });
Document.belongsTo(Workspace, { foreignKey: "workspaceId" });

export default Document;
