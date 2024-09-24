const fs = require("fs");
const path = require("path");

const checkFileService = {
  checkIfRoutesFileExists: (pluginFolderPath) => {
    const routesFilePath = path.join(pluginFolderPath, "Routes.ts");
    return fs.existsSync(routesFilePath);
  },

  checkIfModelsIndexFileExists: (pluginFolderPath) => {
    const modelsFolderPath = path.join(pluginFolderPath, "models");
    const indexFilePath = path.join(modelsFolderPath, "index.ts");
    return fs.existsSync(modelsFolderPath) && fs.existsSync(indexFilePath);
  },
  readJsonFile: (pluginFolderPath, target) => {
    const initJsonFilePath = path.join(pluginFolderPath, target);
    try {
      if (fs.existsSync(initJsonFilePath)) {
        const fileContent = fs.readFileSync(initJsonFilePath, "utf8");
        const jsonObject = JSON.parse(fileContent);
        return jsonObject;
      } else {
        console.error(`File not found: ${initJsonFilePath}`);
        return null;
      }
    } catch (error) {
      console.error(`Error reading or parsing file: ${error.message}`);
      return null;
    }
  },
};

module.exports = checkFileService;
