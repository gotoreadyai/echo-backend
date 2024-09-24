// ------ cli/utils/pluginManager.ts ------
import fs from "fs";
import path from "path";
import inquirer from "inquirer";
import { logError, logWarning } from "./logging";

const PLUGINS_DIR = path.resolve(__dirname, "../../src/plugins");

/**
 * Zwraca listę wszystkich pluginów.
 * @returns Tablica nazw pluginów.
 */
export function getAllPlugins(): string[] {
  console.log(`Checking plugins directory at: ${PLUGINS_DIR}`);
  if (!fs.existsSync(PLUGINS_DIR)) {
    logError(`Plugins directory not found at ${PLUGINS_DIR}`);
    logWarning(`Tworzenie katalogu plugins w ${PLUGINS_DIR}`);
    fs.mkdirSync(PLUGINS_DIR, { recursive: true });
    return [];
  }

  const plugins = fs.readdirSync(PLUGINS_DIR).filter((file) => {
    const pluginPath = path.join(PLUGINS_DIR, file);
    return fs.statSync(pluginPath).isDirectory();
  });

  return plugins;
}

/**
 * Zwraca listę aktywnych pluginów.
 * @returns Tablica nazw aktywnych pluginów.
 */
export function getActivePlugins(): string[] {
  const plugins = getAllPlugins();
  return plugins.filter((plugin) => {
    const activeFilePath = path.join(PLUGINS_DIR, plugin, "active");
    return fs.existsSync(activeFilePath);
  });
}

/**
 * Zwraca listę nieaktywnych pluginów.
 * @returns Tablica nazw nieaktywnych pluginów.
 */
export function getInactivePlugins(): string[] {
  const plugins = getAllPlugins();
  return plugins.filter((plugin) => {
    const activeFilePath = path.join(PLUGINS_DIR, plugin, "active");
    return !fs.existsSync(activeFilePath);
  });
}

/**
 * Promptuje użytkownika do wyboru pluginu.
 * @param plugins Tablica nazw pluginów.
 * @param action Akcja wykonywana na pluginie (np. "activate", "deactivate").
 * @returns Wybrana nazwa pluginu lub `null` jeśli użytkownik wybrał powrót.
 */
export async function promptForPluginSelection(
  plugins: string[],
  action: string
): Promise<string | null> {
  const returnToMenuOption = "Return to Main Menu";

  const choices = [
    { name: returnToMenuOption, value: null },
    ...plugins.map((plugin) => ({ name: plugin, value: plugin })),
  ];

  const { selectedPlugin } = await inquirer.prompt([
    {
      type: "list",
      name: "selectedPlugin",
      message: `Select a plugin to ${action}:`,
      choices: choices,
    },
  ]);

  return selectedPlugin;
}

/**
 * Aktywuje wybrany plugin.
 * @param plugin Nazwa pluginu do aktywacji.
 */
export function activatePlugin(plugin: string): void {
  const activeFilePath = path.join(PLUGINS_DIR, plugin, "active");
  fs.writeFileSync(activeFilePath, "");
}

/**
 * Dezaktywuje wybrany plugin.
 * @param plugin Nazwa pluginu do dezaktywacji.
 */
export function deactivatePlugin(plugin: string): void {
  const activeFilePath = path.join(PLUGINS_DIR, plugin, "active");
  if (fs.existsSync(activeFilePath)) {
    fs.unlinkSync(activeFilePath);
  }
}
