// ------ cli/services/pluginService.ts ------
import fs from "fs";
import path from "path";
import {
  logSuccess,
  logError,
  logWarning,
} from "../utils/logging";
import { executeCommand } from "../utils";

export async function activatePlugin(pluginName: string): Promise<void> {
  logSuccess("Activating plugin...");

  const pluginsDir = path.resolve(__dirname, "../../src/plugins");
  const pluginDir = path.join(pluginsDir, pluginName);
  const activeFilePath = path.join(pluginDir, "active");

  // Aktywacja pluginu poprzez utworzenie pliku 'active'
  fs.writeFileSync(activeFilePath, "");
  logSuccess(`------------------------------------------------------------`);
  logSuccess(`Plugin '${pluginName}' został aktywowany.`);
  logSuccess(`------------------------------------------------------------`);

  // Sprawdzenie, czy plugin zawiera katalog 'models' z plikiem 'index.ts'
  const modelsDir = path.join(pluginDir, "models");
  const modelsIndexPath = path.join(modelsDir, "index.ts");
  const hasModels =
    fs.existsSync(modelsDir) &&
    fs.statSync(modelsDir).isDirectory() &&
    fs.existsSync(modelsIndexPath) &&
    fs.statSync(modelsIndexPath).isFile();

  if (hasModels) {
    logSuccess("Models directory with 'index.ts' found in the plugin.");
  } else {
    logWarning(
      "No 'models/index.ts' found in the plugin. Skipping migration and seeder generation and application."
    );
  }

  const projectRoot = path.resolve(__dirname, "../../");

  if (hasModels) {
    try {
      // Generowanie migracji
      const migrationsDir = path.join(projectRoot, "migrations");
      const seedersDir = path.join(projectRoot, "seeders");
      const pluginsRootDir = path.join(projectRoot, "src", "plugins");

      logSuccess(`Generating migrations for plugin '${pluginName}'...`);

      // Lista plików migracji przed generacją
      const filesBeforeMigrations = fs.existsSync(migrationsDir)
        ? fs.readdirSync(migrationsDir)
        : [];

      executeCommand(
        `npm run generate:migrations -- ${pluginName}`,
        projectRoot
      );
      logSuccess("Migrations generated successfully.");

      // Lista plików migracji po generacji
      const filesAfterMigrations = fs.existsSync(migrationsDir)
        ? fs.readdirSync(migrationsDir)
        : [];

      // Określenie nowych plików migracji
      const newMigrationFiles = filesAfterMigrations.filter(
        (file) => !filesBeforeMigrations.includes(file)
      );

      // Filtracja plików migracji związanych z wybranym pluginem
      const pluginMigrationFiles = newMigrationFiles.filter((file) =>
        file.includes(`create-${pluginName}`)
      );

      if (pluginMigrationFiles.length > 0) {
        logSuccess("Created migration files:");
        pluginMigrationFiles.forEach((file) => {
          logSuccess(`- ${file}`);
        });
      } else {
        logError(
          `No new migration files were created for plugin '${pluginName}'.`
        );
      }

      // Aplikowanie wszystkich oczekujących migracji
      logSuccess("Applying all pending migrations...");
      executeCommand(`npx sequelize-cli db:migrate`, projectRoot);
      logSuccess("All pending migrations applied successfully.");

      // Generowanie seeders
      logSuccess("Generating seeders for plugin...");

      // Lista plików seederów przed generacją
      const filesBeforeSeeders = fs.existsSync(seedersDir)
        ? fs.readdirSync(seedersDir)
        : [];

      executeCommand(
        `npm run generate:seeders -- ${pluginName}`,
        projectRoot
      );
      logSuccess("Seeders generated successfully.");

      // Lista plików seederów po generacji
      const filesAfterSeeders = fs.existsSync(seedersDir)
        ? fs.readdirSync(seedersDir)
        : [];

      // Określenie nowych plików seederów
      const newSeederFiles = filesAfterSeeders.filter(
        (file) => !filesBeforeSeeders.includes(file)
      );

      // Filtracja plików seederów związanych z wybranym pluginem
      const pluginSeederFiles = newSeederFiles.filter((file) =>
        file.includes(`${pluginName}`)
      );

      if (pluginSeederFiles.length > 0) {
        logSuccess("Created seeder files:");
        pluginSeederFiles.forEach((file) => {
          logSuccess(`- ${file}`);
        });
      } else {
        logError(
          `No new seeder files were created for plugin '${pluginName}'.`
        );
      }

      // Aplikowanie wszystkich oczekujących seederów
      logSuccess("Applying all pending seeders...");
      executeCommand(`npx sequelize-cli db:seed:all`, projectRoot);
      logSuccess("All pending seeders applied successfully.");
    } catch (error: any) {
      logError(`Error generating or applying migrations/seeders: ${error.message}`);
    }
  }

  // Sprawdzenie, czy w pluginie istnieje plik Routes.ts
  const routesFilePath = path.join(pluginDir, "Routes.ts");
  if (fs.existsSync(routesFilePath) && fs.statSync(routesFilePath).isFile()) {
    try {
      const appTsPath = path.join(projectRoot, "src", "app.ts");
      let appTsContent = fs.readFileSync(appTsPath, "utf-8");

      // Przygotowanie linii do dodania
      const importLine = `import ${pluginName}Routes from "./plugins/${pluginName}/Routes";\n`;
      const useLine = `app.use(${pluginName}Routes);\n`;

      // Sekcje w app.ts
      const importSectionStart = "/* #PLUGINS IMPORTS */";
      const importSectionEnd = "/* !#PLUGINS IMPORTS */";
      const pluginsSectionStart = "/* #PLUGINS */";
      const pluginsSectionEnd = "/* !#PLUGINS */";

      // Dodanie importu, jeśli jeszcze nie istnieje
      if (!appTsContent.includes(importLine.trim())) {
        const importParts = appTsContent.split(importSectionEnd);
        if (importParts.length === 2) {
          appTsContent =
            importParts[0] +
            importLine +
            importSectionEnd +
            importParts[1];
          logSuccess(`Added import for plugin '${pluginName}' to app.ts.`);
        } else {
          logWarning(
            `Import section markers not found in app.ts. Skipping import addition.`
          );
        }
      } else {
        logWarning(
          `Import for plugin '${pluginName}' already exists in app.ts.`
        );
      }

      // Dodanie app.use, jeśli jeszcze nie istnieje
      if (!appTsContent.includes(useLine.trim())) {
        const pluginsParts = appTsContent.split(pluginsSectionEnd);
        if (pluginsParts.length === 2) {
          // Usuń wszelkie istniejące puste linie między markerami
          const pluginsContent = pluginsParts[0].replace(/\n\s*\n/g, "\n");
          appTsContent =
            pluginsContent +
            useLine +
            pluginsSectionEnd +
            pluginsParts[1];
          logSuccess(`Added app.use for plugin '${pluginName}' to app.ts.`);
        } else {
          logWarning(
            `Plugins section markers not found in app.ts. Skipping app.use addition.`
          );
        }
      } else {
        logWarning(
          `app.use for plugin '${pluginName}' already exists in app.ts.`
        );
      }

      // Zapisanie zaktualizowanej zawartości do pliku app.ts
      fs.writeFileSync(appTsPath, appTsContent, "utf-8");
      logSuccess(`app.ts has been updated successfully.`);
    } catch (error: any) {
      logError(`Error updating app.ts: ${error.message}`);
    }
  } else {
    logWarning(
      `Routes.ts not found in plugin '${pluginName}'. Skipping import and app.use addition.`
    );
  }
}
