import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../db';

interface DocumentAttributes {
  id: string;
  title: string;
  content: string;
}

interface DocumentCreationAttributes extends Optional<DocumentAttributes, 'id'> {}

class Document extends Model<DocumentAttributes, DocumentCreationAttributes> implements DocumentAttributes {
  public id!: string;
  public title!: string;
  public content!: string;
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
      type: DataTypes.TEXT,
      allowNull: false,
    }
  },
  {
    sequelize,
    modelName: 'Document',
  }
);

export default Document;
