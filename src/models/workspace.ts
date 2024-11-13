import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../db";
import User from "./user";
import { generateUniqueSlug } from "../utils/slugGenerator";

interface WorkspaceAttributes {
  id: string;
  title: string;
  content: Record<string, any>;
  ownerId: string;
  slug: string;
  plugin: string;
}

interface WorkspaceCreationAttributes
  extends Optional<WorkspaceAttributes, "id"> {}

class Workspace
  extends Model<WorkspaceAttributes, WorkspaceCreationAttributes>
  implements WorkspaceAttributes
{
  public id!: string;
  public title!: string;
  public content!: Record<string, any>;
  public ownerId!: string;
  public slug!: string;
  public plugin!: string;
}

Workspace.init(
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
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      defaultValue: "",
    },
    content: {
      type: DataTypes.JSONB,
      defaultValue: {},
      allowNull: false,
    },
    plugin: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    ownerId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Workspace",
    hooks: {
      beforeCreate: async (workspace: Workspace) => {
        workspace.slug = await generateUniqueSlug(
          Workspace,
          workspace.title,
          workspace.id
        );
      },
    },
  }
);

// Relacja z modelem User
Workspace.belongsTo(User, { foreignKey: "ownerId", as: "owner" });
export default Workspace;
