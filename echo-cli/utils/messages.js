const drawFrame = (message, key) => {
  let colorCode;
  
  switch (key) {
    case 'ADD':
      colorCode = "\x1b[32m"; // Green text for "ADD"
      break;
    case 'EXE':
      colorCode = "\x1b[95m"; // Light magenta text for "EXE"
      break;
    default:
      colorCode = "\x1b[34m"; // Default to blue text
  }
console.log("\n");

  console.log(colorCode, "\x1b[40m", "╭─────╮", "\x1b[0m"); // Using the selected color
  console.log(
    colorCode,
    "\x1b[40m",
    "│",
    key,
    "│",
    "\x1b[0m",
    message,
    "\x1b[0m"
  );
  console.log(colorCode, "\x1b[40m", "╰─────╯", "\x1b[0m");
};

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
        hasRoutesFile ? "istnieje (realizuję)" : "nie istnieje (pomijam)"
      } w katalogu pluginu. ${msg.color.reset}`
    );
  },
  isModel: (hasModels) => {
    console.log(
      `${hasModels ? msg.color.green : msg.color.orange}Plik models/index.ts ${
        hasModels ? "istnieje (realizuję)" : "nie istnieje (pomijam)"
      } w katalogu pluginu.${msg.color.reset}`
    );
  },
  isSeed: (hasModels) => {
    console.log(
      `${
        hasModels ? msg.color.green : msg.color.orange
      }Plik seedSlug/_init.json ${
        hasModels ? "istnieje (tworzę)" : "nie istnieje (pomijam)"
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

module.exports = { msg, drawFrame };
