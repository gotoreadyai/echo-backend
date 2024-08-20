import { DataTypes, Model } from "sequelize";
import sequelize from "../db";
import Category from "./category";
import Document from "./document";

class DocumentCategory extends Model {}

DocumentCategory.init(
  {
    documentId: {
      type: DataTypes.UUID,
      references: {
        model: "Documents",
        key: "id",
      },
      primaryKey: true,
    },
    categoryId: {
      type: DataTypes.UUID,
      references: {
        model: "Categories",
        key: "id",
      },
      primaryKey: true,
    },
  },
  {
    sequelize,
    modelName: "DocumentCategory",
    tableName: "DocumentCategories", // Określenie nazwy tabeli
  }
);

// Definiowanie relacji między modelami
Document.belongsToMany(Category, {
  through: DocumentCategory,
  foreignKey: "documentId",
});
Category.belongsToMany(Document, {
  through: DocumentCategory,
  foreignKey: "categoryId",
});

export default DocumentCategory;
