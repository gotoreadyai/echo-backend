import { DataTypes, Model } from 'sequelize';
import sequelize from '../db';

class DocumentCategory extends Model {}

DocumentCategory.init(
  {
    documentId: {
      type: DataTypes.UUID,
      references: {
        model: 'Documents',
        key: 'id'
      },
      primaryKey: true
    },
    categoryId: {
      type: DataTypes.UUID,
      references: {
        model: 'Categories',
        key: 'id'
      },
      primaryKey: true
    }
  },
  {
    sequelize,
    modelName: 'DocumentCategory',
    tableName: 'DocumentCategories' // Określenie nazwy tabeli
  }
);

export default DocumentCategory;
