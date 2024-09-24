// ------ cli/handleDeactivatePlugin.ts ------
import fs from 'fs';
import path from 'path';
import { 
  logSuccess, 
  logError, 
  logWarning, 
  getActivePlugins, 
  promptForPluginSelection, 
  executeCommand 
} from "./utils";

export async function handleDeactivatePlugin(): Promise<void> {
  logSuccess('Deactivating plugin...');

  const activePlugins = getActivePlugins();

  if (activePlugins.length === 0) {
    logSuccess('No active plugins to deactivate.');
    return;
  }

  const selectedPlugin = await promptForPluginSelection(activePlugins, "deactivate");

  if (!selectedPlugin) {
    logWarning("Returning to main menu...");
    return;
  }

  const pluginDir = path.join(__dirname, "..", "src", "plugins", selectedPlugin);
  const activeFilePath = path.join(pluginDir, 'active');

  // Undo the migrations associated with the plugin
  try {
    const projectRoot = path.join(__dirname, '..');
    const migrationsDir = path.join(projectRoot, 'migrations');

    // Get the list of migration files for the plugin
    const allMigrationFiles = fs.existsSync(migrationsDir) ? fs.readdirSync(migrationsDir) : [];

    // Filter migration files related to the selected plugin
    const pluginMigrationFiles = allMigrationFiles.filter((file) =>
      file.includes(`create-${selectedPlugin}`)
    );

    if (pluginMigrationFiles.length > 0) {
      // Sort the migrations in reverse order to undo them properly
      pluginMigrationFiles.sort().reverse();

      logSuccess(`Undoing migrations for plugin '${selectedPlugin}'...`);

      for (const migrationFile of pluginMigrationFiles) {
        logSuccess(`Undoing migration: ${migrationFile}`);
        // Undo the migration
        executeCommand(`npx sequelize-cli db:migrate:undo --name ${migrationFile}`, projectRoot);
      }

      logSuccess(`Migrations for plugin '${selectedPlugin}' have been undone.`);

      // Delete the migration files associated with the plugin
      logSuccess(`Deleting migration files for plugin '${selectedPlugin}'...`);

      for (const migrationFile of pluginMigrationFiles) {
        const migrationFilePath = path.join(migrationsDir, migrationFile);
        if (fs.existsSync(migrationFilePath)) {
          fs.unlinkSync(migrationFilePath);
          logSuccess(`Deleted migration file: ${migrationFile}`);
        } else {
          logError(`Migration file not found: ${migrationFile}`);
        }
      }

      logSuccess(`Migration files for plugin '${selectedPlugin}' have been deleted.`);
    } else {
      logError(`No migrations found for plugin '${selectedPlugin}'.`);
    }
  } catch (error: any) {
    logError(`Error undoing migrations: ${error.message}`);
    return;
  }

  // Remove import and app.use from app.ts if Routes.ts exists
  try {
    const routesFilePath = path.join(pluginDir, "Routes.ts");
    if (fs.existsSync(routesFilePath) && fs.statSync(routesFilePath).isFile()) {
      const projectRoot = path.join(__dirname, "..");
      const appTsPath = path.join(projectRoot, "src", "app.ts");
      let appTsContent = fs.readFileSync(appTsPath, "utf-8");

      // Prepare regex patterns to remove import and app.use lines
      const importRegex = new RegExp(`import\\s+${selectedPlugin}Routes\\s+from\\s+['"]\\.\\/plugins\\/${selectedPlugin}\\/Routes['"];?`, 'g');
      const useRegex = new RegExp(`app\\.use\\(['"]\\/${selectedPlugin}['"],\\s*${selectedPlugin}Routes\\);?`, 'g');

      // Remove import and app.use lines
      const newAppTsContent = appTsContent
        .replace(importRegex, '')
        .replace(useRegex, '');

      if (newAppTsContent !== appTsContent) {
        fs.writeFileSync(appTsPath, newAppTsContent, "utf-8");
        logSuccess(`Removed import and app.use for plugin '${selectedPlugin}' from app.ts.`);
      } else {
        logWarning(`Import and app.use for plugin '${selectedPlugin}' not found in app.ts.`);
      }
    } else {
      logWarning(
        `Routes.ts not found in plugin '${selectedPlugin}'. Skipping import and app.use removal.`
      );
    }
  } catch (error: any) {
    logError(`Error updating app.ts: ${error.message}`);
  }

  // Deactivate the plugin by removing the 'active' file
  try {
    if (fs.existsSync(activeFilePath)) {
      fs.unlinkSync(activeFilePath);
      logSuccess(`------------------------------------------------------------`);
      logSuccess(`Plugin '${selectedPlugin}' has been deactivated.`);
      logSuccess(`------------------------------------------------------------`);
    } else {
      logWarning(`Active file not found for plugin '${selectedPlugin}'.`);
    }
  } catch (error: any) {
    logError(`Error removing active file: ${error.message}`);
  }
}
