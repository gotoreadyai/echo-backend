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

  // Deactivate the plugin by removing the 'active' file
  fs.unlinkSync(activeFilePath);

  logSuccess(`------------------------------------------------------------`);
  logSuccess(`Plugin '${selectedPlugin}' has been deactivated.`);
  logSuccess(`------------------------------------------------------------`);
}
