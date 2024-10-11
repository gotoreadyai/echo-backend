const pluralize = require("pluralize");
const fs = require("fs");
const path = require("path");
const { msg } = require("./../utils/messages");
const cmdService = require("./commandService");
const { showTopBar, clearTopBar } = require("./topBarService");

const modelService = {
  models: [], // Array to store migration file names associated with plugins.

  /**
   * Initiates the process of removing migrations for a specified plugin.
   * @param {Object} plugin - The plugin object.
   */
  removeMigrations: (plugin) => {
    modelService.parseIndex(plugin); // Parse the index file to get migration details.
    modelService.undoMigrations(plugin); // Undo the migrations based on the parsed data.
  },

  /**
   * Undoes migrations for the specified plugin.
   * If there are no migrations to undo, logs a message and exits.
   * Sorts migrations from newest to oldest and executes the undo command.
   * @param {Object} plugin - The plugin object.
   */
  undoMigrations: (plugin) => {
    if (modelService.models.length === 0) {
      console.log("Brak migracji do cofnięcia."); // No migrations to undo.
      return;
    }

    showTopBar(`Cofanie migracji dla pluginu: ${plugin.name}...`); // Display progress message.

    // Sort migrations from newest to oldest
    const sortedModels = modelService.models.sort((a, b) => {
      const timestampA = parseInt(a.split("-")[0], 10);
      const timestampB = parseInt(b.split("-")[0], 10);
      return timestampB - timestampA; // Sort in descending order.
    });

    // Iterate over sorted migration files and undo each migration
    sortedModels.forEach((migrationFile) => {
      const cmdUndo = `npx sequelize-cli db:migrate:undo --name ${migrationFile}`;
      console.log(cmdUndo); // Log the command to be executed.

      const statusUndo = cmdService.runCmd(cmdUndo); // Execute the undo command.
      if (statusUndo === 0) {
        const migrationFilePath = path.join(
          __dirname,
          "../../migrations",
          migrationFile
        );

        // Attempt to delete the migration file after successful undo
        try {
          fs.unlinkSync(migrationFilePath);
          msg.exeOK({
            name: `Cofnięto migrację i usunięto plik: ${migrationFile}`,
          });
        } catch (err) {
          msg.exeBAD({
            name: `Cofnięto migrację, ale nie udało się usunąć pliku: ${migrationFile}`,
          });
        }
      } else {
        msg.exeBAD({ name: `Nie udało się cofnąć migracji: ${migrationFile}` });
      }
    });

    clearTopBar(); // Clear the progress message.
  },

  /**
   * Parses the index file of the specified plugin to identify model imports.
   * Updates the models array with migration files that match the identified models.
   * @param {Object} plugin - The plugin object.
   */
  parseIndex: (plugin) => {
    console.log('parseIndex', plugin);
    const modelsDirectory = path.join(
      __dirname,
      "../../src/plugins",
      plugin.name,
      "models"
    );
    const indexFilePath = path.join(modelsDirectory, "index.ts");

    // Check if the index file exists
    if (!fs.existsSync(indexFilePath)) {
      throw new Error(`Plik ${indexFilePath} nie istnieje.`); // Error if the index file is missing.
    }

    const fileContent = fs.readFileSync(indexFilePath, "utf-8");
    console.log('fileContent', fileContent);
    
    // Extract import statements to identify models
    const imports = fileContent
      .split("\n")
      .filter((line) => line.startsWith("import "))
      .map((line) => {
        const match = line.match(/import\s+(\w+)\s+from\s+/);
        return match ? `${plugin.name}-${pluralize(match[1])}` : null; // Create pluralized model names.
      })
      .filter(Boolean);

    const migrationsDirectory = path.join(__dirname, "../../migrations");

    const matchingMigrationFiles = []; // Array to hold matching migration files.

    // Read all migration files in the migrations directory
    const migrationFiles = fs.readdirSync(migrationsDirectory);
    imports.forEach((importName) => {
      const matchingFile = migrationFiles.find((file) =>
        file.includes(importName) // Check for files that match import names.
      );
      if (matchingFile) {
        matchingMigrationFiles.push(matchingFile); // Add matching files to the array.
      }
    });
    modelService.models = matchingMigrationFiles; // Update the models property.
    console.log("modelService.models został zaktualizowany poprawnie"); // Log successful update.
  },

  /**
   * Activates migrations for the specified plugin by generating and applying them.
   * @param {Object} plugin - The plugin object.
   */
  runAsActivate: (plugin) => {
    showTopBar(`Processing migrations for plugin: ${plugin.name}...`); // Display progress message.
    const cmd = "npm run generate:migrations -- " + plugin.name; // Command to generate migrations.
    const statusM1 = cmdService.runCmd(cmd); // Run the command to generate migrations.
    clearTopBar();
    statusM1 === 0 && msg.exeOK(plugin); // Log success message if command executed successfully.
    statusM1 !== 0 && msg.exeBAD(plugin); // Log error message if command failed.

    showTopBar(`Applying migrations for plugin: ${plugin.name}...`); // Display applying message.
    const cmdMigrate = "npx sequelize-cli db:migrate"; // Command to apply migrations.
    const statusMigrate = cmdService.runCmd(cmdMigrate); // Run the command to apply migrations.
    clearTopBar();
    statusMigrate === 0 && msg.exeOK(plugin); // Log success message if command executed successfully.
    statusMigrate !== 0 && msg.exeBAD(plugin); // Log error message if command failed.
  },
};

module.exports = modelService;
