// ------ cli/index.ts ------
import inquirer from "inquirer";

import { logSuccess, logError } from "./utils/logging";
import {
  activatePluginCommand,
  deactivatePluginCommand,
  listPluginsCommand,
  runMigrationCommand,
  runSeederCommand,
} from "./commands";

async function mainMenu(): Promise<void> {
  const choices = [
    { name: "Listuj pluginy", value: "list" },
    { name: "Aktywuj plugin", value: "activate" },
    { name: "Dezaktywuj plugin", value: "deactivate" },
    { name: "Uruchom migracje", value: "runMigration" },
    { name: "Uruchom seedery", value: "runSeeder" },
    { name: "Wyjście", value: "exit" },
  ];

  const { action } = await inquirer.prompt([
    {
      type: "list",
      name: "action",
      message: "Wybierz akcję:",
      choices: choices,
    },
  ]);

  switch (action) {
    case "list":
      listPluginsCommand();
      break;
    case "activate":
      await activatePluginCommand();
      break;
    case "deactivate":
      await deactivatePluginCommand();
      break;
    case "runMigration":
      runMigrationCommand();
      break;
    case "runSeeder":
      runSeederCommand();
      break;
    case "exit":
      logSuccess("Zakończenie programu.");
      process.exit(0);
    default:
      logError("Nieznana akcja.");
  }

  // Po wykonaniu akcji wracamy do menu
  await mainMenu();
}

// Inicjalizacja programu
async function init(): Promise<void> {
  logSuccess("Witaj w CLI Menedżera Pluginów!");
  await mainMenu();
}

init().catch((error) => {
  logError(`Nieoczekiwany błąd: ${error.message}`);
  process.exit(1);
});
