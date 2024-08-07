import fs from 'fs';
import path from 'path';
import { Document, Category, DocumentCategory } from './src/models';

/**
 * Generates a schema from the models and writes it to a file.
 * npx ts-node generateSchema.ts
 * 
 * @returns {void}
 */
const generateSchema = (): void => {
  const models: {[key: string]: {name: string; attributes: {[key: string]: any}}} = {
    Document: {
      name: Document.name,
      attributes: Document.rawAttributes,
    },
    Category: {
      name: Category.name,
      attributes: Category.rawAttributes,
    },
    DocumentCategory: {
      name: DocumentCategory.name,
      attributes: DocumentCategory.rawAttributes,
    },
  };

  const schema: {models: {[key: string]: {name: string; attributes: {[key: string]: any}}}} = {
    models: Object.keys(models).reduce((acc: {[key: string]: {name: string; attributes: {[key: string]: any}}}, modelName: string) => {
      const model: {name: string; attributes: {[key: string]: any}} = models[modelName];
      acc[model.name] = {
        name: model.name,
        attributes: model.attributes,
      };
      return acc;
    }, {}),
  };

  const outputPath: string = path.join(__dirname, 'generatedSchema.json');
  fs.writeFileSync(outputPath, JSON.stringify(schema, null, 2));
};

generateSchema();
