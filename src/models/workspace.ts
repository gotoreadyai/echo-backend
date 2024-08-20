import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../db';

interface WorkspaceAttributes {
  id: string;
  title: string;
}

interface WorkspaceCreationAttributes extends Optional<WorkspaceAttributes, 'id'> {}

class Workspace extends Model<WorkspaceAttributes, WorkspaceCreationAttributes> implements WorkspaceAttributes {
  public id!: string;
  public title!: string;
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
    }
  },
  {
    sequelize,
    modelName: 'Workspace',
  }
);

export default Workspace;
