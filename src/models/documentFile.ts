import { DataTypes, Model } from "sequelize";
import sequelize from "../db";
import Document from "./document";
import File from "./file";

class DocumentFile extends Model {}

DocumentFile.init(
  {
    documentId: {
      type: DataTypes.UUID,
      references: {
        model: "Documents",
        key: "id",
      },
      primaryKey: true,
    },
    fileId: {
      type: DataTypes.UUID,
      references: {
        model: "Files",
        key: "id",
      },
      primaryKey: true,
    },
  },
  {
    sequelize,
    modelName: "DocumentFile",
    tableName: "DocumentFiles",
    timestamps: false, 
  }
);

// Definiowanie relacji między modelami
Document.belongsToMany(File, { through: DocumentFile, foreignKey: "documentId" });
File.belongsToMany(Document, { through: DocumentFile, foreignKey: "fileId" });

export default DocumentFile;
