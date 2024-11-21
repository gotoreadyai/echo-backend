require("dotenv").config();
const fs = require("fs");
const path = require("path");
const fileService = require("./file");

const checkDependenciesService = {
  isParentActive: false,
  isActive: false,
  pluginsDirectory: "",
  init: (pluginName) => {
    console.log("");
    console.log(`┏╍\x1b[100m ${pluginName} \x1b[0m`);
    this.pluginsDirectory = path.join(__dirname, "..", "..", "src", "plugins");
    const folderPath = path.join(this.pluginsDirectory, pluginName);
    this.isActive = fs.existsSync(path.join(folderPath, "active"));
    if (!this.isActive) {
      checkDependenciesService.turnOn(folderPath, pluginName);
    } else {
      checkDependenciesService.turnOff(folderPath, pluginName);
    }
    return this.isParentActive;
  },

  turnOn: (folderPath, pluginName) => {
    try {
      const parentPlugin = path.join(folderPath, "parent");
      if (fs.existsSync(parentPlugin)) {
        const fileContent = fs.readFileSync(parentPlugin, "utf8");
        const parentPath = path.join(this.pluginsDirectory, fileContent);
        this.isParentActive = fs.existsSync(path.join(parentPath, "active"));
        console.log(
          `┠ \x1b[36m${fileContent}\x1b[0m plugin is parent of ${pluginName}. Activate \x1b[36m${fileContent}\x1b[0m first!`
        );
      } else {
        console.log("┠ Top level plugin");
        this.isParentActive = true;
      }
    } catch (err) {
      console.error("Error saving plugins.ts:", err);
    }
  },
  turnOff: (folderPath, pluginName) => {
    const fs = require("fs");
    const path = require("path");

    try {
      this.isParentActive = true;
      const directories = fileService.getDirectories(this.pluginsDirectory);
      const activeParents = [];

      directories.forEach((dir) => {
        const activeFilePath = path.join(this.pluginsDirectory, dir, "active");
        if (fs.existsSync(activeFilePath)) {
          const parentPlugin = path.join(this.pluginsDirectory, dir, "parent");
          if (fs.existsSync(parentPlugin)) {
            activeParents.push(dir);
          }
        }
      });

      activeParents.forEach((dir) => {
        const parentPlugin = path.join(this.pluginsDirectory, dir, "parent");
        if (fs.existsSync(parentPlugin)) {
          const fileContent = fs.readFileSync(parentPlugin, "utf8");
          if (pluginName === fileContent) {
            console.log(
              `┠ \x1b[36m${dir}\x1b[0m plugin is parent of ${pluginName}. Remove \x1b[36m${dir}\x1b[0m first!`
            );
            this.isParentActive = false;
          }
        }
      });
    } catch (err) {
      console.error("Error saving plugins.ts:", err);
    }
  },
};

module.exports = checkDependenciesService;
