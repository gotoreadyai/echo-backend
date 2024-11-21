const inquirer = require("inquirer").default;
const checkDependenciesService = require("./services/checkDependencies");
const toogleService = require("./services/tooglePlugin");
const model = require("./services/prepareModels");
const seedService = require("./services/prepareSeedes");
const file = require("./services/file");

const appJsService = require("./services/appJsService");
const {msg} = require("./utils/messages");
const plugins = toogleService.getPlugins();

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
    const plugin = plugins[selectedIndex];

    /* 
      CHECK DEPS */
    
    const hasDependencies = await checkDependenciesService.init(plugin.name);
    if (!hasDependencies) console.error("┗\x1B[31m", "Exited due to missing dependencies.");
    if (!hasDependencies) break;

    /* 
      RUN TOGGLE */
    
    plugin.selected = !plugin.selected;
    toogleService.toggleActiveStatus(plugin.folderPath, plugin.selected);

    /* 
      CREATE ROUTES */
    const hasRoutesFile = file.ifFileExists(plugin.folderPath, "Routes.ts");
    hasRoutesFile && appJsService.updateAppJs(plugin.name, plugin.selected);

    /* 
      CREATE MODELS */
    const hasModels = file.ifFileExists(plugin.folderPath, "models/index.ts");
    hasModels && plugin.selected && model.runAsActivate(plugin);
    hasModels && !plugin.selected && model.removeMigrations(plugin);

    /* 
      CREATE SEED */
    const hasSeed = file.ifFileExists(plugin.folderPath, "seedSlug/_init.json");
    hasSeed && plugin.selected && seedService.initSeeder(plugin);
    hasSeed && !plugin.selected && seedService.removeSeeder(plugin);

    msg.isSelected(plugin);
    msg.isRute(hasRoutesFile);
    msg.isModel(hasModels);
    msg.isSeed(hasSeed);

    console.log('╍╍');
  }
}

main();
