// ------ cli/handleActivatePlugin.ts ------
import fs from "fs";
import path from "path";
import { 
  logSuccess, 
  logError, 
  logWarning, 
  getInactivePlugins, 
  promptForPluginSelection, 
  executeCommand 
} from "./utils";

export async function handleActivatePlugin(): Promise<void> {
  logSuccess("Activating plugin...");

  const inactivePlugins = getInactivePlugins();

  if (inactivePlugins.length === 0) {
    logSuccess("All plugins are already active.");
    return;
  }

  const selectedPlugin = await promptForPluginSelection(inactivePlugins, "activate");

  if (!selectedPlugin) {
    logWarning("Returning to main menu...");
    return;
  }

  const pluginDir = path.join(__dirname, "..", "src", "plugins", selectedPlugin);
  const activeFilePath = path.join(pluginDir, "active");

  // Activate the plugin by creating an 'active' file
  fs.writeFileSync(activeFilePath, "");

  logSuccess(`------------------------------------------------------------`);
  logSuccess(`Plugin '${selectedPlugin}' has been activated.`);
  logSuccess(`------------------------------------------------------------`);

  // Check if the plugin contains a 'models' subdirectory
  const modelsDir = path.join(pluginDir, "models");
  if (fs.existsSync(modelsDir) && fs.statSync(modelsDir).isDirectory()) {
    logSuccess("Models found in the plugin directory.");
  }

  // Generate and apply migrations
  const projectRoot = path.join(__dirname, "..");
  const migrationsDir = path.join(projectRoot, "migrations");
  const pluginsRootDir = path.join(projectRoot, "src", "plugins"); // Adjust the path as needed

  logSuccess(`${pluginsRootDir}/${selectedPlugin}`);

  if (fs.existsSync(pluginsRootDir) && fs.statSync(pluginsRootDir).isDirectory()) {
    try {
      logSuccess("Generating migrations...");

      // Capture the list of migration files before generation
      const filesBefore = fs.existsSync(migrationsDir) ? fs.readdirSync(migrationsDir) : [];

      executeCommand(`npm run generate:migrations -- ${selectedPlugin}`, projectRoot);
      logSuccess("Migrations generated successfully.");

      // Capture the list of migration files after generation
      const filesAfter = fs.existsSync(migrationsDir) ? fs.readdirSync(migrationsDir) : [];

      // Determine the new files by comparing before and after lists
      const newFiles = filesAfter.filter((file) => !filesBefore.includes(file));

      // Filter the files related to the selected plugin
      const pluginFiles = newFiles.filter((file) => file.includes(`create-${selectedPlugin}`));

      if (pluginFiles.length > 0) {
        logSuccess("Created migration files:");
        pluginFiles.forEach((file) => {
          logSuccess(`- ${file}`);
        });
      } else {
        logError(`No new migration files were created for plugin '${selectedPlugin}'.`);
      }

      // Apply all pending migrations
      logSuccess("Applying all pending migrations...");
      executeCommand(`npx sequelize-cli db:migrate`, projectRoot);
      logSuccess("All pending migrations applied successfully.");
    } catch (error: any) {
      logError(`Error generating or applying migrations: ${error.message}`);
    }
  } else {
    logError(`Plugins directory does not exist at ${pluginsRootDir}.`);
  }
}
