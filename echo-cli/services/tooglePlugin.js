require('dotenv').config();
const fs = require("fs");
const path = require("path");

const toggleService = {
  getPlugins: () => {
    const pluginsDirectory = path.join(__dirname, "..", "..", "src", "plugins");
    const folders = fs.readdirSync(pluginsDirectory);
    
    return folders.map(folder => {
      const folderPath = path.join(pluginsDirectory, folder);
      const activeFilePath = path.join(folderPath, "active");
      return {
        name: folder,
        folderPath,
        selected: fs.existsSync(activeFilePath),
      };
    });
  },

  toggleActiveStatus: (folderPath, isSelected) => {
    const pluginsTsPath = path.join(__dirname, "../../", process.env.FRONTEND_PATH, "plugins.ts");
    const activeFilePath = path.join(folderPath, "active");
    const pluginName = path.basename(folderPath);

    // Aktywacja lub dezaktywacja pliku 'active'
    if (isSelected) {
      fs.writeFileSync(activeFilePath, ""); // Tworzenie pustego pliku 'active'
    } else {
      if (fs.existsSync(activeFilePath)) {
        fs.unlinkSync(activeFilePath); // Usuwanie pliku 'active'
      }
    }

    // Wczytaj istniejącą zawartość plugins.ts
    let fileContent = "";
    if (fs.existsSync(pluginsTsPath)) {
      fileContent = fs.readFileSync(pluginsTsPath, "utf8");
    } else {
      // Jeśli plik nie istnieje, zainicjuj go z podstawową strukturą
      fileContent = `export const Plugins: string[] = [\n];\n`;
    }

    // Wyodrębnij istniejącą tablicę pluginów
    const pluginsArrayMatch = fileContent.match(/export\s+const\s+Plugins\s*:\s*string\[\]\s*=\s*\[([\s\S]*?)\];/);
    let plugins = [];

    if (pluginsArrayMatch && pluginsArrayMatch[1]) {
      const pluginsString = pluginsArrayMatch[1];
      // Rozdziel pluginy, usuwając przecinki i białe znaki
      plugins = pluginsString
        .split(',')
        .map(plugin => plugin.trim().replace(/^"|"$/g, '').replace(/^'|'$/g, ''))
        .filter(plugin => plugin.length > 0);
    }

    // Aktualizuj listę pluginów w zależności od statusu
    if (isSelected) {
      if (!plugins.includes(pluginName)) {
        plugins.push(pluginName);
      }
    } else {
      plugins = plugins.filter(plugin => plugin !== pluginName);
    }

    // Utwórz nową zawartość pliku plugins.ts
    const newFileContent = `export const Plugins: string[] = [\n  ${plugins.map(p => `"${p}"`).join(',\n  ')}\n];\n`;

    // Zapisz zaktualizowaną zawartość do plugins.ts
    try {
      fs.writeFileSync(pluginsTsPath, newFileContent, "utf8");
      console.log(`plugins.ts został zaktualizowany:\n${newFileContent}`);
    } catch (err) {
      console.error("Błąd podczas zapisywania plugins.ts:", err);
    }
  },
};

module.exports = toggleService;
