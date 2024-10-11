require('dotenv').config();
const fs = require("fs");
const path = require("path");

const toggleService = {
  /**
   * Retrieves the list of plugins from the plugins directory.
   * @returns {Array} Array of plugin objects containing name, folder path, and active status.
   */
  getPlugins: () => {
    const pluginsDirectory = path.join(__dirname, "..", "..", "src", "plugins");
    const folders = fs.readdirSync(pluginsDirectory);
    
    return folders.map(folder => {
      const folderPath = path.join(pluginsDirectory, folder);
      const activeFilePath = path.join(folderPath, "active");
      return {
        name: folder,
        folderPath,
        selected: fs.existsSync(activeFilePath), // Check if the plugin is active.
      };
    });
  },

  /**
   * Toggles the active status of a plugin.
   * @param {String} folderPath - The path of the plugin folder.
   * @param {Boolean} isSelected - The desired active status of the plugin.
   */
  toggleActiveStatus: (folderPath, isSelected) => {
    const pluginsTsPath = path.join(__dirname, "../../", process.env.FRONTEND_PATH, "plugins.ts");
    const activeFilePath = path.join(folderPath, "active");
    const pluginName = path.basename(folderPath);

    // Activate or deactivate the 'active' file
    if (isSelected) {
      fs.writeFileSync(activeFilePath, ""); // Create an empty 'active' file.
    } else {
      if (fs.existsSync(activeFilePath)) {
        fs.unlinkSync(activeFilePath); // Remove the 'active' file.
      }
    }

    // Load the existing content of plugins.ts
    let fileContent = "";
    if (fs.existsSync(pluginsTsPath)) {
      fileContent = fs.readFileSync(pluginsTsPath, "utf8");
    } else {
      // If the file does not exist, initialize it with a basic structure
      fileContent = `export const Plugins: string[] = [\n];\n`;
    }

    // Extract the existing plugins array
    const pluginsArrayMatch = fileContent.match(/export\s+const\s+Plugins\s*:\s*string\[\]\s*=\s*\[([\s\S]*?)\];/);
    let plugins = [];

    if (pluginsArrayMatch && pluginsArrayMatch[1]) {
      const pluginsString = pluginsArrayMatch[1];
      // Split plugins, removing commas and whitespace
      plugins = pluginsString
        .split(',')
        .map(plugin => plugin.trim().replace(/^"|"$/g, '').replace(/^'|'$/g, ''))
        .filter(plugin => plugin.length > 0);
    }

    // Update the list of plugins based on the active status
    if (isSelected) {
      if (!plugins.includes(pluginName)) {
        plugins.push(pluginName); // Add the plugin if it's not already included.
      }
    } else {
      plugins = plugins.filter(plugin => plugin !== pluginName); // Remove the plugin if it's deactivated.
    }

    // Create new content for the plugins.ts file
    const newFileContent = `export const Plugins: string[] = [\n  ${plugins.map(p => `"${p}"`).join(',\n  ')}\n];\n`;

    // Save the updated content to plugins.ts
    try {
      fs.writeFileSync(pluginsTsPath, newFileContent, "utf8");
      console.log(`plugins.ts has been updated:\n${newFileContent}`);
    } catch (err) {
      console.error("Error saving plugins.ts:", err);
    }
  },
};

module.exports = toggleService;
