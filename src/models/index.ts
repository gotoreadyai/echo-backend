import Document from './document';
import Category from './category';
import DocumentCategory from './documentCategory';

// Definiowanie relacji między modelami
Document.belongsToMany(Category, { through: DocumentCategory, foreignKey: 'documentId' });
Category.belongsToMany(Document, { through: DocumentCategory, foreignKey: 'categoryId' });

export {
  Document,
  Category,
  DocumentCategory
};
