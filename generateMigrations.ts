import fs from 'fs';
import path from 'path';
import { Sequelize, DataTypes, DataType } from 'sequelize';

// Pobranie ścieżki z argumentów, lub użycie domyślnej
const modelsPath = path.resolve(process.argv[2] || path.join(__dirname, 'src', 'models'));
const migrationsPath = path.resolve(__dirname, 'migrations');

// Funkcja do konwersji typu z Sequelize na typ w SQL
function mapSequelizeTypeToSQL(type: DataType): string {
  if (type instanceof DataTypes.UUID) {
    return 'UUID';
  } else if (type instanceof DataTypes.STRING) {
    const length = (type as any).options?.length || 255;
    return `STRING(${length})`;
  } else if (type instanceof DataTypes.TEXT) {
    return 'TEXT';
  } else if (type instanceof DataTypes.DATE) {
    return 'DATE';
  } else if (type instanceof DataTypes.ENUM) {
    const values = (type as any).options?.values;
    if (!values) {
      throw new Error('ENUM type requires values');
    }
    const sqlValues = values.map((v: string) => `'${v}'`).join(', ');
    return `ENUM(${sqlValues})`;
  } else {
    throw new Error(`Nieobsługiwany typ: ${type.constructor.name}`);
  }
}

// Generowanie migracji na podstawie modeli
function generateMigrationForModel(modelFile: string): void {
  const model = require(path.join(modelsPath, modelFile)).default;
  const tableName = model.getTableName();
  const attributes = model.rawAttributes as Record<string, any>;
  let migrationContent = `'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('${tableName}', {
`;

  for (const [key, attribute] of Object.entries(attributes)) {
    const sqlType = mapSequelizeTypeToSQL(attribute.type);
    let allowNull = attribute.allowNull === false ? 'false' : 'true';

    if (key === 'id') {
      allowNull = 'false';
    }

    const defaultValue = attribute.defaultValue
      ? `, defaultValue: Sequelize.${attribute.defaultValue}`
      : '';
    const primaryKey = attribute.primaryKey ? ', primaryKey: true' : '';

    // Obsługa kluczy obcych (foreign keys)
    let references = '';
    if (attribute.references) {
      references = `,
        references: {
          model: '${attribute.references.model}',
          key: '${attribute.references.key}'
        }`;

      if (attribute.onUpdate) {
        references += `,
        onUpdate: '${attribute.onUpdate}'`;
      }

      if (attribute.onDelete) {
        references += `,
        onDelete: '${attribute.onDelete}'`;
      }
    }

    migrationContent += `      ${key}: {
        type: Sequelize.${sqlType},
        allowNull: ${allowNull}${defaultValue}${primaryKey}${references}
      },
`;
  }

  migrationContent += `    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('${tableName}');
  }
};
`;

  const migrationFileName = `${Date.now()}-create-${tableName}.js`;
  fs.writeFileSync(path.join(migrationsPath, migrationFileName), migrationContent);
  console.log(`Generated migration for ${modelFile} -> ${migrationFileName}`);
}

// Przetwarzanie wszystkich modeli w katalogu, z pominięciem index.ts
const models = fs.readdirSync(modelsPath)
  .filter((file: string) => (file.endsWith('.js') || file.endsWith('.ts')) && file !== 'index.ts');

models.forEach(generateMigrationForModel);
