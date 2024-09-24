const msg = {
  color: {
    green: "\x1b[32m",
    orange: "\x1b[33m",
    lightMagenta: "\x1b[95m",
    reset: "\x1b[0m",
  },
  isSelected: (plugin) => {
    console.log(
      `${msg.color.green}Plugin "${plugin.name}" został ${
        plugin.selected ? "zaznaczony" : "odznaczony"
      }.${msg.color.reset}`
    );
  },
  isRute: (hasRoutesFile) => {
    console.log(
      `${hasRoutesFile ? msg.color.green : msg.color.orange}Plik Routes.js ${
        hasRoutesFile ? "istnieje" : "nie istnieje"
      } w katalogu pluginu.${msg.color.reset}`
    );
  },
  isModel: (hasModels) => {
    console.log(
      `${hasModels ? msg.color.green : msg.color.orange}Plik models/index.ts ${
        hasModels ? "istnieje" : "nie istnieje"
      } w katalogu pluginu.${msg.color.reset}`
    );
  },

  exeOK: (plugin) => {
    console.log(
      `${msg.color.lightMagenta}Command executed successfully for plugin: ${plugin.name}${msg.color.reset}`
    );
    console.log(
      `${msg.color.lightMagenta}----------------------------------------------------------------${msg.color.reset}`
    );
  },
  exeBAD: (plugin) => {
    console.error(`Command execution failed for plugin: ${plugin.name}`);
  },
};

module.exports = msg;
