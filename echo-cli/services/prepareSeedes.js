const fs = require("fs");
const path = require("path");
const cmdService = require("./commandService");
const { msg, drawFrame } = require("./../utils/messages");
const file = require("./file");
const { generateTimestamp } = require("./../utils/timestamp");

const SEEDERS_DIR = path.join(__dirname, "../../seeders");

const seedService = {
  /**
   * Inicjalizuje proces tworzenia seederów dla danego pluginu.
   * @param {Object} plugin - Obiekt pluginu zawierający m.in. nazwę.
   */
  initSeeder(plugin) {
    console.log("Initializing seeder...");
    const initData = this.loadInitFile(plugin);
    if (initData) {
      console.log("Data loaded from _init.json");
      const groupedData = this.groupDataByModel(initData);
      this.processGroupedData(groupedData, plugin);
    }
  },

  /**
   * Usuwa wszystkie seedy związane z danym pluginem w odwrotnej kolejności tworzenia oraz usuwa ich pliki.
   * @param {Object} plugin - Obiekt pluginu.
   */
  removeSeeder(plugin) {
    console.log(`Removing seeders for plugin '${plugin.name}'...`);

    const seederFiles = this.getPluginSeederFiles(plugin.name);
    if (seederFiles.length === 0) {
      console.log(`No seeders found for plugin '${plugin.name}'.`);
      return;
    }

    // Grupowanie seederów według modelu
    const groupedSeeders = this.groupSeedersByModel(seederFiles);

    // Sortowanie modeli w odwrotnej kolejności tworzenia seederów
    const sortedModels = Array.from(groupedSeeders.keys()).sort((a, b) => {
      const latestA = groupedSeeders.get(a).reduce((max, seeder) => {
        const timestampNum = parseInt(seeder.timestamp, 10);
        return isNaN(timestampNum) ? max : Math.max(max, timestampNum);
      }, 0);
      const latestB = groupedSeeders.get(b).reduce((max, seeder) => {
        const timestampNum = parseInt(seeder.timestamp, 10);
        return isNaN(timestampNum) ? max : Math.max(max, timestampNum);
      }, 0);
      return latestB - latestA;
    });

    // Iteracja po posortowanych modelach i usuwanie seederów w ramach każdej grupy
    for (const model of sortedModels) {
      const seeders = groupedSeeders.get(model);
      // Sortowanie seederów w ramach modelu w odwrotnej kolejności timestamp
      seeders.sort((a, b) => b.timestamp.localeCompare(a.timestamp));

      for (const { filename } of seeders) {
        this.undoSeeder(filename);
        this.deleteSeederFile(filename);
      }
    }

    console.log(`All seeders for plugin '${plugin.name}' have been removed.`);
  },

  /**
   * Pobiera listę plików seederów dla danego pluginu.
   * @param {String} pluginName - Nazwa pluginu.
   * @returns {Array} Lista obiektów z nazwami plików i timestampami.
   */
  getPluginSeederFiles(pluginName) {
    try {
      const allFiles = fs.readdirSync(SEEDERS_DIR);
      return allFiles
        .filter(file => file.includes(`-${pluginName}-`) && file.endsWith(".js"))
        .map(file => {
          const timestamp = file.split("-")[0];
          return { filename: file, timestamp };
        });
    } catch (error) {
      console.error("Error reading seeders directory:", error);
      return [];
    }
  },

  /**
   * Grupuje seederów według modelu.
   * @param {Array} seederFiles - Lista plików seederów.
   * @returns {Map} Mapowanie modeli do listy seederów.
   */
  groupSeedersByModel(seederFiles) {
    return seederFiles.reduce((map, seeder) => {
      const parts = seeder.filename.split("-");
      if (parts.length < 3) return map; // Oczekuje formatu: timestamp-pluginName-model.js
      const modelWithExt = parts.slice(2).join("-"); // Obsługuje modele z myślnikami
      const model = path.basename(modelWithExt, ".js");
      if (!map.has(model)) map.set(model, []);
      map.get(model).push(seeder);
      return map;
    }, new Map());
  },

  /**
   * Cofanie działania seeda za pomocą Sequelize CLI.
   * @param {String} seederFileName - Nazwa pliku seeda.
   */
  undoSeeder(seederFileName) {
    drawFrame(`Uninstalling seeder '${seederFileName}'`, "REM");
    const command = `npx sequelize-cli db:seed:undo --seed ${seederFileName}`;
    const status = cmdService.runCmd(command);

    if (status === 0) {
      msg.exeOK({ name: `Seeder '${seederFileName}' undone successfully.` });
    } else {
      msg.exeBAD({ name: `Failed to undo seeder '${seederFileName}'.` });
    }
  },

  /**
   * Usuwa plik seeda z systemu plików.
   * @param {String} seederFileName - Nazwa pliku seeda.
   */
  deleteSeederFile(seederFileName) {
    const seederFilePath = path.join(SEEDERS_DIR, seederFileName);
    if (fs.existsSync(seederFilePath)) {
      try {
        fs.unlinkSync(seederFilePath);
        msg.exeOK({ name: `Seeder file '${seederFileName}' deleted successfully.` });
      } catch (error) {
        console.error(`Error deleting seeder file '${seederFileName}':`, error);
      }
    } else {
      console.warn(`Seeder file '${seederFileName}' does not exist.`);
    }
  },

  /**
   * Grupuje dane inicjalizacyjne według modelu.
   * @param {Array} initData - Dane inicjalizacyjne z _init.json.
   * @returns {Map} Grupowane dane według modelu.
   */
  groupDataByModel(initData) {
    return initData.reduce((map, item) => {
      const model = item.model;
      if (!map.has(model)) map.set(model, []);
      map.get(model).push(item);
      return map;
    }, new Map());
  },

  /**
   * Przetwarza grupowane dane modeli i tworzy seedy.
   * @param {Map} groupedData - Grupowane dane według modelu.
   * @param {Object} plugin - Obiekt pluginu.
   */
  processGroupedData(groupedData, plugin) {
    const schemasPath = path.join(__dirname, "../schemas");

    groupedData.forEach((data, model) => {
      drawFrame(`Processing model '${model}' with ${data.length} records`, "INI");
      data.forEach(item => this.processItem(item, plugin));

      let schema = file.readTextFile(schemasPath, `_${model}.js`);
      schema = this.addDataToSchema(schema, data);

      const seederFileName = `${generateTimestamp()}-${plugin.name}-${model}.js`;
      this.saveModifiedSchema(SEEDERS_DIR, seederFileName, schema);
      this.runSeeder(seederFileName);
    });
  },

  /**
   * Przetwarza pojedynczy rekord danych.
   * @param {Object} item - Pojedynczy rekord danych.
   * @param {Object} plugin - Obiekt pluginu.
   */
  processItem(item, plugin) {
    if (item.data?.slug && item.data?.content) {
      const jsonFilePath = path.join(
        __dirname,
        "../../src/plugins",
        plugin.name,
        "seedSlug",
        `${item.data.slug}.json`
      );
      this.addContentFromJsonFile(item, jsonFilePath);
    }
  },

  /**
   * Dodaje zawartość z pliku JSON do rekordu danych.
   * @param {Object} item - Pojedynczy rekord danych.
   * @param {String} jsonFilePath - Ścieżka do pliku JSON.
   */
  addContentFromJsonFile(item, jsonFilePath) {
    if (fs.existsSync(jsonFilePath)) {
      try {
        const jsonData = JSON.parse(fs.readFileSync(jsonFilePath, "utf8"));
        item.data.content = { ...item.data.content, ...jsonData };
        drawFrame(`Added data from ${path.basename(jsonFilePath)} to content.`, "ADD");
      } catch (error) {
        console.error(`Error parsing JSON from ${path.basename(jsonFilePath)}:`, error);
      }
    } else {
      console.warn(`JSON file ${path.basename(jsonFilePath)} not found.`);
    }
  },

  /**
   * Dodaje dane do schematu seeda.
   * @param {String} schema - Zawartość pliku schematu.
   * @param {Array} data - Dane do dodania.
   * @returns {String} Zmodyfikowany schemat.
   */
  addDataToSchema(schema, data) {
    return schema.replace(
      /const records = \[\];/,
      `const records = ${JSON.stringify(data, null, 2)};`
    );
  },

  /**
   * Zapisuje zmodyfikowany schemat seeda do pliku.
   * @param {String} seederPath - Ścieżka do katalogu seederów.
   * @param {String} seederFileName - Nazwa pliku seeda.
   * @param {String} schema - Zawartość schematu seeda.
   */
  saveModifiedSchema(seederPath, seederFileName, schema) {
    file.writeTextFile(seederPath, seederFileName, schema);
    msg.exeOK({ name: `Seeder file '${seederFileName}' created successfully.` });
  },

  /**
   * Uruchamia seeda za pomocą Sequelize CLI.
   * @param {String} seederFileName - Nazwa pliku seeda.
   */
  runSeeder(seederFileName) {
    const command = `npx sequelize-cli db:seed --seed ${seederFileName}`;
    const status = cmdService.runCmd(command);
    if (status === 0) {
      msg.exeOK({ name: `Seeder '${seederFileName}' executed successfully.` });
    } else {
      msg.exeBAD({ name: `Failed to execute seeder '${seederFileName}'.` });
    }
  },

  /**
   * Ładuje plik inicjalizacyjny _init.json dla danego pluginu.
   * @param {Object} plugin - Obiekt pluginu.
   * @returns {Array|null} Dane inicjalizacyjne lub null w przypadku błędu.
   */
  loadInitFile(plugin) {
    const initFilePath = path.join(__dirname, "../../src/plugins", plugin.name, "seedSlug", "_init.json");
    const initData = file.readJsonFile(path.dirname(initFilePath), path.basename(initFilePath));

    if (initData) {
      console.log("The _init.json file was successfully loaded.");
      return initData;
    } else {
      console.error(`Failed to load _init.json in plugin '${plugin.name}'.`);
      return null;
    }
  },
};

module.exports = seedService;
