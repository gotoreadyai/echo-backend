const fs = require("fs");
const path = require("path");

const toogleService = {
  getPlugins: () => {
    const baseDirectory = __dirname;
    const pluginsDirectory = path.join(
      baseDirectory,
      "..",
      "..",
      "src",
      "plugins"
    );
    return fs.readdirSync(pluginsDirectory).map((folder) => {
      const folderPath = path.join(pluginsDirectory, folder);
      return {
        name: folder,
        folderPath,
        selected: fs.existsSync(path.join(folderPath, "active")),
      };
    });
  },

  toggleActiveStatus: (folderPath, isSelected) => {
    const activeFilePath = path.join(folderPath, "active");
    if (isSelected) {
      fs.writeFileSync(activeFilePath, ""); // Tworzenie pustego pliku 'active'
    } else if (fs.existsSync(activeFilePath)) {
      fs.unlinkSync(activeFilePath); // Usuwanie pliku 'active'
    }
  },
};

module.exports = toogleService;
