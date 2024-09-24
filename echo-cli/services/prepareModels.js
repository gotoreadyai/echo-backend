const fs = require("fs");
const path = require("path");

const modelService = {
  models: [],
  initModels: (plugin) => {
    modelService.models = modelService.getModels(plugin);
    console.log('modelService.models',modelService.models);
  },
  getModels: (plugin) => {
    const modelsDirectory = path.join(__dirname, "../../src/plugins" ,plugin.name, "models");
    return fs.readdirSync(modelsDirectory).map((folder) => {
      const folderPath = path.join(modelsDirectory, folder);
      return {
        name: folder,
        folderPath,
        created: false,
      };
    });

  },
};

module.exports = modelService;
