import * as fs from "fs";
import * as path from "path";
import { Sequelize } from "sequelize";
import pluralize from "pluralize";

// Importuj instancję Sequelize z pliku `db.js`
import sequelize from "./src/db";

// Inicjalizacja pustego obiektu na modele
const export_path = "../backoffice-service/models_EXPORT";
const models: { [key: string]: any } = {};
const migrationsDir = path.join(__dirname, "migrations");
const modelsDir = path.join(__dirname, export_path);
const modelsFilePath = path.join(__dirname, `${export_path}/models.ts`);

// Upewnij się, że katalog `models` istnieje
if (!fs.existsSync(modelsDir)) {
  fs.mkdirSync(modelsDir);
}

// Funkcja do parsowania migracji
function parseMigration(filePath: string) {
  const migration = require(filePath);

  const upFunction = migration.up;

  if (typeof upFunction === "function") {
    const dummyQueryInterface = {
      createTable: (tableName: string, attributes: any) => {
        const model = sequelize.define(tableName, attributes, {
          tableName,
          timestamps: false,
        });
        models[tableName] = model;
      },
      addColumn: (tableName: string, attributeName: string, options: any) => {
        if (models[tableName]) {
          models[tableName].rawAttributes[attributeName] = options;
        }
      },
      foreignKey: (tableName: string, attributeName: string, options: any) => {
        if (models[tableName]) {
          models[tableName].rawAttributes[attributeName].references =
            options.references;
          models[tableName].rawAttributes[attributeName].onDelete =
            options.onDelete;
          models[tableName].rawAttributes[attributeName].onUpdate =
            options.onUpdate;
        }
      },
      // Możesz dodać więcej metod, jeśli Twoje migracje je wykorzystują
    };

    upFunction(dummyQueryInterface, Sequelize);
  }
}

// Funkcja do generowania plików dla poszczególnych modeli
function generateModelFiles() {
  const modelExports: string[] = [];

  for (const [tableName, model] of Object.entries(models)) {
    const attributes = model.rawAttributes;
    const modelFileContent = `
export const ${tableName} = {
  ${Object.entries(attributes)
    .map(([attr, details]) => {
      const attributeDetails = details as any; // Rzutowanie typu
      const parts = [
        `type: '${attributeDetails.type?.key}'`,
        `allowNull: ${attributeDetails.allowNull ?? true}`,
        attributeDetails.primaryKey ? "primaryKey: true" : "",
        attributeDetails.references
          ? `references: ${JSON.stringify(attributeDetails.references)}`
          : "",
        attributeDetails.onDelete
          ? `onDelete: '${attributeDetails.onDelete}'`
          : "",
        attributeDetails.onUpdate
          ? `onUpdate: '${attributeDetails.onUpdate}'`
          : "",
      ].filter(Boolean); // Usuwa puste stringi
      return `  ${attr}: {\n    ${parts.join(",\n    ")}\n  }`;
    })
    .join(",\n")}
};`;

    // Zapisz plik dla każdego modelu
    fs.writeFileSync(
      path.join(modelsDir, `${tableName}.ts`),
      modelFileContent,
      "utf8"
    );
  }

  // Zapisz listę eksportów w models.ts
  let modelsFileContent: string = ``;
  Object.keys(models).map((tableName) => {
    modelsFileContent += `import { ${tableName} } from "./${tableName}";\n`;
  });
  modelsFileContent += `\nexport const ModelData: { [key: string]: any } = {\n`;
  Object.keys(models).map((tableName) => {
    modelsFileContent += `  ${tableName.charAt(0).toLowerCase() + tableName.slice(1)}: ${tableName},\n`;
  });
  modelsFileContent += `}`;

  modelsFileContent += `\nexport const ModelSingular : { [key: string]: string } = {\n`;
  Object.keys(models).map((tableName) => {
    const lower = tableName.charAt(0).toLowerCase() + tableName.slice(1);
    modelsFileContent += `  ${lower}: "${pluralize.singular(lower)}",\n`;
  });
  modelsFileContent += `}`;
  fs.writeFileSync(modelsFilePath, modelsFileContent, "utf8");
}

// Funkcja do ładowania modeli z migracji
async function loadModelsFromMigrations() {
  const files = fs.readdirSync(migrationsDir);

  for (const file of files) {
    if (file.endsWith(".ts") || file.endsWith(".js")) {
      const filePath = path.join(migrationsDir, file);
      parseMigration(filePath);
    }
  }

  // Generowanie plików dla modeli i głównego pliku models.ts
  generateModelFiles();

  console.log(
    `Pliki models.ts oraz poszczególne pliki modeli zostały wygenerowane w: ${export_path}`
  );
}

// Uruchomienie funkcji ładowania modeli z migracji
loadModelsFromMigrations().catch(console.error);
