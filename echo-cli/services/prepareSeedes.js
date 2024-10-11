const fs = require("fs");
const path = require("path");
const cmdService = require("./commandService");
const { msg, drawFrame } = require("./../utils/messages");
const file = require("./file");
const { generateTimestamp } = require("./../utils/timestamp");

const SEEDERS_DIR = path.join(__dirname, "../../seeders");

const seedService = {
  /**
   * Initializes the process of creating seeders for a given plugin.
   * @param {Object} plugin - The plugin object containing the name.
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
   * Removes all seeders related to a given plugin in reverse order of creation and deletes their files.
   * @param {Object} plugin - The plugin object.
   */
  removeSeeder(plugin) {
    console.log(`Removing seeders for plugin '${plugin.name}'...`);

    const seederFiles = this.getPluginSeederFiles(plugin.name);
    if (seederFiles.length === 0) {
      console.log(`No seeders found for plugin '${plugin.name}'.`);
      return;
    }

    /**
     * Grouping seeders by model.
     */
    const groupedSeeders = this.groupSeedersByModel(seederFiles);

    /**
     * Sorting models in reverse order of seeders creation.
     */
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

    /**
     * Iterates through sorted models and removes seeders within each group.
     */
    for (const model of sortedModels) {
      const seeders = groupedSeeders.get(model);
      // Sorting seeders within the model in reverse timestamp order
      seeders.sort((a, b) => b.timestamp.localeCompare(a.timestamp));

      for (const { filename } of seeders) {
        this.undoSeeder(filename);
        this.deleteSeederFile(filename);
      }
    }

    console.log(`All seeders for plugin '${plugin.name}' have been removed.`);
  },

  /**
   * Retrieves a list of seeder files for a given plugin.
   * @param {String} pluginName - The name of the plugin.
   * @returns {Array} List of objects with filenames and timestamps.
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
   * Groups seeders by model.
   * @param {Array} seederFiles - List of seeder files.
   * @returns {Map} Mapping of models to lists of seeders.
   */
  groupSeedersByModel(seederFiles) {
    return seederFiles.reduce((map, seeder) => {
      const parts = seeder.filename.split("-");
      if (parts.length < 3) return map; // Expects format: timestamp-pluginName-model.js
      const modelWithExt = parts.slice(2).join("-"); // Handles models with dashes
      const model = path.basename(modelWithExt, ".js");
      if (!map.has(model)) map.set(model, []);
      map.get(model).push(seeder);
      return map;
    }, new Map());
  },

  /**
   * Undoes the seeder action using Sequelize CLI.
   * @param {String} seederFileName - The name of the seeder file.
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
   * Deletes the seeder file from the file system.
   * @param {String} seederFileName - The name of the seeder file.
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
   * Groups initialization data by model.
   * @param {Array} initData - Initialization data from _init.json.
   * @returns {Map} Grouped data by model.
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
   * Processes grouped model data and creates seeders.
   * @param {Map} groupedData - Grouped data by model.
   * @param {Object} plugin - The plugin object.
   */
  processGroupedData(groupedData, plugin) {
    const pluginSchemasPath = path.join(__dirname, "../../src/plugins/", plugin.name, "seedSlug", "schemas");
    const schemasPath = path.join(__dirname, "../schemas");

    groupedData.forEach((data, model) => {
      drawFrame(`Processing model '${model}' with ${data.length} records`, "INI");
      data.forEach(item => this.processItem(item, plugin));

      let schema = file.readTextFile(pluginSchemasPath ? pluginSchemasPath : schemasPath, `_${model}.js`);
      schema = this.addDataToSchema(schema, data);

      const seederFileName = `${generateTimestamp()}-${plugin.name}-${model}.js`;
      this.saveModifiedSchema(SEEDERS_DIR, seederFileName, schema);
      this.runSeeder(seederFileName);
    });
  },

  /**
   * Processes a single data record.
   * @param {Object} item - A single data record.
   * @param {Object} plugin - The plugin object.
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
   * Adds content from a JSON file to a data record.
   * @param {Object} item - A single data record.
   * @param {String} jsonFilePath - Path to the JSON file.
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
   * Adds data to the seeder schema.
   * @param {String} schema - The contents of the schema file.
   * @param {Array} data - The data to add.
   * @returns {String} The modified schema.
   */
  addDataToSchema(schema, data) {
    return schema.replace(
      /const records = \[\];/,
      `const records = ${JSON.stringify(data, null, 2)};`
    );
  },

  /**
   * Saves the modified seeder schema to a file.
   * @param {String} seederPath - Path to the seeders directory.
   * @param {String} seederFileName - The name of the seeder file.
   * @param {String} schema - The contents of the seeder schema.
   */
  saveModifiedSchema(seederPath, seederFileName, schema) {
    file.writeTextFile(seederPath, seederFileName, schema);
    msg.exeOK({ name: `Seeder file '${seederFileName}' created successfully.` });
  },

  /**
   * Runs the seeder using Sequelize CLI.
   * @param {String} seederFileName - The name of the seeder file.
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
   * Loads the initialization file _init.json for a given plugin.
   * @param {Object} plugin - The plugin object.
   * @returns {Array|null} Initialization data or null in case of error.
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
