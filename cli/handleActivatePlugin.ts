// ------ cli/handleActivatePlugin.ts ------
import fs from "fs";
import path from "path";
import {
  logSuccess,
  logError,
  logWarning,
  getInactivePlugins,
  promptForPluginSelection,
  executeCommand,
} from "./utils";

export async function handleActivatePlugin(): Promise<void> {
  logSuccess("Activating plugin...");

  const inactivePlugins = getInactivePlugins();

  if (inactivePlugins.length === 0) {
    logSuccess("All plugins are already active.");
    return;
  }

  const selectedPlugin = await promptForPluginSelection(
    inactivePlugins,
    "activate"
  );

  if (!selectedPlugin) {
    logWarning("Returning to main menu...");
    return;
  }

  const pluginDir = path.join(
    __dirname,
    "..",
    "src",
    "plugins",
    selectedPlugin
  );
  const activeFilePath = path.join(pluginDir, "active");

  // Activate the plugin by creating the 'active' file
  fs.writeFileSync(activeFilePath, "");

  logSuccess(`------------------------------------------------------------`);
  logSuccess(`Plugin '${selectedPlugin}' has been activated.`);
  logSuccess(`------------------------------------------------------------`);

  // Check if the plugin contains a 'models' directory with 'index.ts'
  const projectRoot = path.join(__dirname, "..");
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

  // Generate and apply migrations and seeders only if 'models/index.ts' exists
  if (hasModels) {
    // Generate and apply migrations

    const migrationsDir = path.join(projectRoot, "migrations");
    const seedersDir = path.join(projectRoot, "seeders");
    const pluginsRootDir = path.join(projectRoot, "src", "plugins"); // Adjust path if necessary

    logSuccess(`${pluginsRootDir}/${selectedPlugin}`);

    if (
      fs.existsSync(pluginsRootDir) &&
      fs.statSync(pluginsRootDir).isDirectory()
    ) {
      try {
        logSuccess("Generating migrations...");

        // List migration files before generation
        const filesBeforeMigrations = fs.existsSync(migrationsDir)
          ? fs.readdirSync(migrationsDir)
          : [];

        executeCommand(
          `npm run generate:migrations -- ${selectedPlugin}`,
          projectRoot
        );
        logSuccess("Migrations generated successfully.");

        // List migration files after generation
        const filesAfterMigrations = fs.existsSync(migrationsDir)
          ? fs.readdirSync(migrationsDir)
          : [];

        // Determine new migration files by comparing before and after lists
        const newMigrationFiles = filesAfterMigrations.filter(
          (file) => !filesBeforeMigrations.includes(file)
        );

        // Filter migration files related to the selected plugin
        const pluginMigrationFiles = newMigrationFiles.filter((file) =>
          file.includes(`create-${selectedPlugin}`)
        );

        if (pluginMigrationFiles.length > 0) {
          logSuccess("Created migration files:");
          pluginMigrationFiles.forEach((file) => {
            logSuccess(`- ${file}`);
          });
        } else {
          logError(
            `No new migration files were created for plugin '${selectedPlugin}'.`
          );
        }

        // Apply all pending migrations
        logSuccess("Applying all pending migrations...");
        executeCommand(`npx sequelize-cli db:migrate`, projectRoot);
        logSuccess("All pending migrations applied successfully.");

        // ----------------------------
        // Obsługa Seederów
        // ----------------------------

        logSuccess("Generating seeders...");

        // List seeder files before generation
        const filesBeforeSeeders = fs.existsSync(seedersDir)
          ? fs.readdirSync(seedersDir)
          : [];

        executeCommand(
          `npm run generate:seeders -- ${selectedPlugin}`,
          projectRoot
        );
        logSuccess("Seeders generated successfully.");

        // List seeder files after generation
        const filesAfterSeeders = fs.existsSync(seedersDir)
          ? fs.readdirSync(seedersDir)
          : [];

        // Determine new seeder files by comparing before and after lists
        const newSeederFiles = filesAfterSeeders.filter(
          (file) => !filesBeforeSeeders.includes(file)
        );

        // Filter seeder files related to the selected plugin
        const pluginSeederFiles = newSeederFiles.filter((file) =>
          file.includes(`${selectedPlugin}`)
        );

        if (pluginSeederFiles.length > 0) {
          logSuccess("Created seeder files:");
          pluginSeederFiles.forEach((file) => {
            logSuccess(`- ${file}`);
          });
        } else {
          logError(
            `No new seeder files were created for plugin '${selectedPlugin}'.`
          );
        }

        // Apply all pending seeders
        logSuccess("Applying all pending seeders...");
        executeCommand(`npx sequelize-cli db:seed:all`, projectRoot);
        logSuccess("All pending seeders applied successfully.");
      } catch (error: any) {
        logError(`Error generating or applying migrations/seeders: ${error.message}`);
      }
    } else {
      logError(`Plugins directory does not exist at ${pluginsRootDir}.`);
    }
  }

  // Check if Routes.ts exists in the plugin directory
  const routesFilePath = path.join(pluginDir, "Routes.ts");
  if (fs.existsSync(routesFilePath) && fs.statSync(routesFilePath).isFile()) {
    // Add import and app.use to app.ts
    try {
      const appTsPath = path.join(projectRoot, "src", "app.ts");
      let appTsContent = fs.readFileSync(appTsPath, "utf-8");

      // Prepare lines to add
      const importLine = `import ${selectedPlugin}Routes from "./plugins/${selectedPlugin}/Routes";\n`;
      const useLine = `app.use(${selectedPlugin}Routes);\n`;

      // Sections in app.ts
      const importSectionStart = "/* #PLUGINS IMPORTS */";
      const importSectionEnd = "/* !#PLUGINS IMPORTS */";
      const pluginsSectionStart = "/* #PLUGINS */";
      const pluginsSectionEnd = "/* !#PLUGINS */";

      // Add import if it doesn't already exist
      if (!appTsContent.includes(importLine.trim())) {
        const importParts = appTsContent.split(importSectionEnd);
        if (importParts.length === 2) {
          appTsContent =
            importParts[0] +
            importLine +
            importSectionEnd +
            importParts[1];
          logSuccess(`Added import for plugin '${selectedPlugin}' to app.ts.`);
        } else {
          logWarning(
            `Import section markers not found in app.ts. Skipping import addition.`
          );
        }
      } else {
        logWarning(
          `Import for plugin '${selectedPlugin}' already exists in app.ts.`
        );
      }

      // Add app.use if it doesn't already exist
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
          logSuccess(`Added app.use for plugin '${selectedPlugin}' to app.ts.`);
        } else {
          logWarning(
            `Plugins section markers not found in app.ts. Skipping app.use addition.`
          );
        }
      } else {
        logWarning(
          `app.use for plugin '${selectedPlugin}' already exists in app.ts.`
        );
      }

      // Write the updated app.ts content back to the file
      fs.writeFileSync(appTsPath, appTsContent, "utf-8");
      logSuccess(`app.ts has been updated successfully.`);
    } catch (error: any) {
      logError(`Error updating app.ts: ${error.message}`);
    }
  } else {
    logWarning(
      `Routes.ts not found in plugin '${selectedPlugin}'. Skipping import and app.use addition.`
    );
  }
}
