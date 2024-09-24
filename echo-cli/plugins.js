const inquirer = require("inquirer").default;
const readline = require("readline");
const toogleService = require("./services/tooglePlugin");
const checkFileService = require("./services/checkFile");
const cmdService = require("./services/commandService");
const appJsService = require("./services/appJsService");
const msg = require("./utils/messages");
const plugins = toogleService.getPlugins();

function showTopBar(message) {
  readline.cursorTo(process.stdout, 0, 0);
  readline.clearLine(process.stdout, 0);
  process.stdout.write(message);
}

function clearTopBar() {
  readline.cursorTo(process.stdout, 0, 0);
  readline.clearLine(process.stdout, 0);
}

async function main() {
  while (true) {
    const { selectedIndex } = await inquirer.prompt({
      type: "list",
      name: "selectedIndex",
      message:
        'Select plugins (press Enter to toggle, or select "Finish" to confirm):',
      choices: [
        ...plugins.map((plugin, i) => ({
          name: `${plugin.selected ? "[x]" : "[ ]"} ${plugin.name}`,
          value: i,
        })),
        new inquirer.Separator(),
        { name: "Finish", value: "finish" },
      ],
    });

    if (selectedIndex === "finish") break;

    console.clear();

    const plugin = plugins[selectedIndex];
    plugin.selected = !plugin.selected;
    toogleService.toggleActiveStatus(plugin.folderPath, plugin.selected);

    /* has routes file */
    const hasRoutesFile = checkFileService.checkIfRoutesFileExists(
      plugin.folderPath
    );
    hasRoutesFile && appJsService.updateAppJs(plugin.name, plugin.selected);

    /* 
      MODELS
      has models index file 
    */
    const hasModels = checkFileService.checkIfModelsIndexFileExists(
      plugin.folderPath
    );
    if (hasModels && plugin.selected) {
      showTopBar(`Processing migrations for plugin: ${plugin.name}...`);
      const cmd = "npm run generate:migrations -- " + plugin.name;
      const statusM1 = cmdService.runCmd(cmd);
      clearTopBar();
      console.clear();
      statusM1 === 0 && msg.exeOK(plugin);
      statusM1 !== 0 && msg.exeBAD(plugin);

      showTopBar(`Applying migrations for plugin: ${plugin.name}...`);
      const cmdMigrate = "npx sequelize-cli db:migrate";
      const statusMigrate = cmdService.runCmd(cmdMigrate);
      clearTopBar();
      console.clear();
      statusMigrate === 0 && msg.exeOK(plugin);
      statusMigrate !== 0 && msg.exeBAD(plugin);
    }
    if (hasModels && !plugin.selected) {
      console.log("dezaktivate models");
      // npx sequelize-cli db:migrate:undo --name 1727204525105-create-test-Pools.js
    }

    msg.isSelected(plugin);
    msg.isRute(hasRoutesFile);
    msg.isModel(hasModels);
  }
}

main();
