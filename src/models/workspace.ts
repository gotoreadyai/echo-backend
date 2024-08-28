import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../db';
import User from './user';

interface WorkspaceAttributes {
  id: string;
  title: string;
  content:Record<string, any>;
  ownerId: string;
}

interface WorkspaceCreationAttributes extends Optional<WorkspaceAttributes, 'id'> {}

class Workspace extends Model<WorkspaceAttributes, WorkspaceCreationAttributes> implements WorkspaceAttributes {
  public id!: string;
  public title!: string;
  public content!: Record<string, any>;
  public ownerId!: string;
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
    content: {
      type: DataTypes.JSONB,
      defaultValue: {},
      allowNull: false,
    },
    ownerId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Workspace',
  }
);

// Relacja z modelem User
Workspace.belongsTo(User, { foreignKey: "ownerId", as: "owner" });


export default Workspace;
