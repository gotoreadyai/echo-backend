const pluralize = require("pluralize");
const fs = require("fs");
const path = require("path");
const { msg } = require("./../utils/messages");
const cmdService = require("./commandService");
const { showTopBar, clearTopBar } = require("./topBarService");

const modelService = {
  models: [],
  removeMigrations: (plugin) => {
    modelService.parseIndex(plugin);
    modelService.undoMigrations(plugin);
  },
  undoMigrations: (plugin) => {
    if (modelService.models.length === 0) {
      console.log("Brak migracji do cofnięcia.");
      return;
    }

    showTopBar(`Cofanie migracji dla pluginu: ${plugin.name}...`);

    // Sortowanie migracji od najnowszych do najstarszych
    const sortedModels = modelService.models.sort((a, b) => {
      const timestampA = parseInt(a.split("-")[0], 10);
      const timestampB = parseInt(b.split("-")[0], 10);
      return timestampB - timestampA;
    });

    sortedModels.forEach((migrationFile) => {
      const cmdUndo = `npx sequelize-cli db:migrate:undo --name ${migrationFile}`;
      console.log(cmdUndo);

      const statusUndo = cmdService.runCmd(cmdUndo);
      if (statusUndo === 0) {
        const migrationFilePath = path.join(
          __dirname,
          "../../migrations",
          migrationFile
        );

        // Usuwanie pliku migracji po udanym cofnięciu
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

    clearTopBar();
  },
  parseIndex: (plugin) => {
    console.log('parseIndex',plugin);
    const modelsDirectory = path.join(
      __dirname,
      "../../src/plugins",
      plugin.name,
      "models"
    );
    const indexFilePath = path.join(modelsDirectory, "index.ts");

    if (!fs.existsSync(indexFilePath)) {
      throw new Error(`Plik ${indexFilePath} nie istnieje.`);
    }

    const fileContent = fs.readFileSync(indexFilePath, "utf-8");
    console.log('fileContent',fileContent);
    
    const imports = fileContent
      .split("\n")
      .filter((line) => line.startsWith("import "))
      .map((line) => {
        const match = line.match(/import\s+(\w+)\s+from\s+/);
        return match ? `${plugin.name}-${pluralize(match[1])}` : null;
      })
      .filter(Boolean);

    const migrationsDirectory = path.join(__dirname, "../../migrations");

    const matchingMigrationFiles = [];

    const migrationFiles = fs.readdirSync(migrationsDirectory);
    imports.forEach((importName) => {
      const matchingFile = migrationFiles.find((file) =>
        file.includes(importName)
      );
      if (matchingFile) {
        matchingMigrationFiles.push(matchingFile);
      }
    });
    modelService.models = matchingMigrationFiles;
    console.log("modelService.models został zaktualizowany poprawnie");
  },

  runAsActivate: (plugin) => {
    
    
    showTopBar(`Processing migrations for plugin: ${plugin.name}...`);
    const cmd = "npm run generate:migrations -- " + plugin.name;
    const statusM1 = cmdService.runCmd(cmd);
    clearTopBar();
    statusM1 === 0 && msg.exeOK(plugin);
    statusM1 !== 0 && msg.exeBAD(plugin);

    showTopBar(`Applying migrations for plugin: ${plugin.name}...`);
    const cmdMigrate = "npx sequelize-cli db:migrate";
    const statusMigrate = cmdService.runCmd(cmdMigrate);
    clearTopBar();
    statusMigrate === 0 && msg.exeOK(plugin);
    statusMigrate !== 0 && msg.exeBAD(plugin);
  },
};

module.exports = modelService;
