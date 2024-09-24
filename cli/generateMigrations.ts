import fs from "fs";
import path from "path";
import { DataTypes, DataType } from "sequelize";

// Get the models path from arguments or use the default
const param = process.argv[2];
const modelsPath = path.resolve(
  param
    ? path.join(__dirname, "..", "src", "plugins", param, "models")
    : path.join(__dirname, "..", "src", "models")
);
const migrationsPath = path.resolve(__dirname, "..", "migrations");

// Function to map Sequelize types to SQL types
function mapSequelizeTypeToSQL(type: DataType): string {
  if (type instanceof DataTypes.UUID) {
    return "UUID";
  } else if (type instanceof DataTypes.STRING) {
    const length = (type as any).options?.length || 255;
    return `STRING(${length})`;
  } else if (type instanceof DataTypes.TEXT) {
    return "TEXT";
  } else if (type instanceof DataTypes.JSONB) {
    return "JSONB";
  } else if (type instanceof DataTypes.DATE) {
    return "DATE";
  } else if (type instanceof DataTypes.ENUM) {
    const values = (type as any).options?.values;
    if (!values) {
      throw new Error("ENUM type requires values");
    }
    const sqlValues = values.map((v: string) => `'${v}'`).join(", ");
    return `ENUM(${sqlValues})`;
  } else {
    throw new Error(`Unsupported type: ${type.constructor.name}`);
  }
}

// Generate migration for a model
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
    let allowNull = attribute.allowNull === false ? "false" : "true";

    // Handle the `id` field with `UUIDV4`
    let defaultValue = "";
    if (key === "id") {
      allowNull = "false";
      defaultValue = `, defaultValue: Sequelize.UUIDV4`;
    } else if (attribute.defaultValue !== undefined) {
      if (
        typeof attribute.defaultValue === "object" &&
        attribute.defaultValue.constructor.name === "SequelizeMethod"
      ) {
        defaultValue = `, defaultValue: ${attribute.defaultValue.toString()}`;
      } else if (typeof attribute.defaultValue === "string") {
        defaultValue = `, defaultValue: '${attribute.defaultValue}'`;
      } else if (typeof attribute.defaultValue === "number") {
        defaultValue = `, defaultValue: ${attribute.defaultValue}`;
      } else if (attribute.defaultValue === null) {
        defaultValue = `, defaultValue: null`;
      } else if (typeof attribute.defaultValue === "object") {
        defaultValue = `, defaultValue: ${JSON.stringify(
          attribute.defaultValue
        )}`;
      }
    }

    const primaryKey = attribute.primaryKey ? ", primaryKey: true" : "";

    // Handle unique constraint
    const unique = attribute.unique ? ", unique: true" : "";

    // Handle foreign keys
    let references = "";
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
        allowNull: ${allowNull}${defaultValue}${primaryKey}${unique}${references}
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

  const migrationFileName = `${Date.now()}-create-${
    process.argv[2]
  }-${tableName}.js`;
  fs.writeFileSync(
    path.join(migrationsPath, migrationFileName),
    migrationContent
  );
  console.log(`Generated migration for ${modelFile} -> ${migrationFileName}`);
}

const fileContent = fs.readFileSync(modelsPath + "/index.ts", "utf-8");
const models = fileContent
  .split("\n")
  .filter((line) => line.startsWith("import"))
  .map((line) => {
    const parts = line.split("from");
    const filename = parts[0].replace("import", "").trim() + ".ts";

    return filename.charAt(0).toLowerCase() + filename.slice(1);
  });
models.forEach(generateMigrationForModel);
