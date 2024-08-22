import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../db";
import Document from "./document";

interface FileAttributes {
  id: string;
  name: string;
  type: string;
  url: string;
}

interface FileCreationAttributes extends Optional<FileAttributes, "id"> {}

class File
  extends Model<FileAttributes, FileCreationAttributes>
  implements FileAttributes
{
  public id!: string;
  public name!: string;
  public type!: string;
  public url!: string;
}

File.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: DataTypes.STRING,
    url: DataTypes.STRING,
  },
  {
    sequelize,
    modelName: "File",
  }
);

Document.belongsToMany(File, { through: "DocumentFile" });
File.belongsToMany(Document, { through: "DocumentFile" });

export default File;
