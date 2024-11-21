const fs = require("fs");
const path = require("path");
const { drawFrame } = require("./../utils/messages");
const fileService = {
  ifFileExists: (pluginFolderPath, target) => {
    const targetFilePath = path.join(pluginFolderPath, target);
    return fs.existsSync(targetFilePath);
  },

  readJsonFile: (pluginFolderPath, target) => {
    const initJsonFilePath = path.join(pluginFolderPath, target);
    console.log("initJsonFilePath", initJsonFilePath);

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

  readTextFile: (pluginFolderPath, target) => {
    const textFilePath = path.join(pluginFolderPath, target);

    try {
      if (fs.existsSync(textFilePath)) {
        const fileContent = fs.readFileSync(textFilePath, "utf8");
        return fileContent;
      } else {
        console.error(`File not found: ${textFilePath}`);
        return null;
      }
    } catch (error) {
      console.error(`Error reading file: ${error.message}`);
      return null;
    }
  },

  writeTextFile: (pluginFolderPath, target, content) => {
    const textFilePath = path.join(pluginFolderPath, target);

    try {
      fs.writeFileSync(textFilePath, content, "utf8");
      drawFrame(`File written successfully to: ${target}`, "ADD");
    } catch (error) {
      console.error(`Error writing file: ${error.message}`);
    }
  },

  getDirectories: (target) => {
    const items = fs.readdirSync(target, { withFileTypes: true });
    const directories = items
      .filter((item) => item.isDirectory())
      .map((dir) => dir.name);
      return directories
 
  }
};

module.exports = fileService;
