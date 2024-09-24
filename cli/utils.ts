// ------ cli/utils.ts ------
import fs from "fs";
import path from "path";
import inquirer from "inquirer";
import { execSync } from "child_process";

const GREEN_COLOR = "\x1b[32m";
const RED_COLOR = "\x1b[31m";
const ORANGE_COLOR = "\x1b[38;5;214m";
const RESET_COLOR = "\x1b[0m";

/**
 * Loguje komunikat w kolorze zielonym.
 * @param message Komunikat do zalogowania.
 */
export function logSuccess(message: string): void {
  console.log(`${GREEN_COLOR}${message}${RESET_COLOR}`);
}

/**
 * Loguje komunikat w kolorze czerwonym.
 * @param message Komunikat do zalogowania.
 */
export function logError(message: string): void {
  console.error(`${RED_COLOR}${message}${RESET_COLOR}`);
}

/**
 * Loguje komunikat w kolorze pomarańczowym.
 * @param message Komunikat do zalogowania.
 */
export function logWarning(message: string): void {
  console.warn(`${ORANGE_COLOR}${message}${RESET_COLOR}`);
}

/**
 * Zwraca listę wszystkich pluginów.
 * @returns Tablica nazw pluginów.
 */
export function getAllPlugins(): string[] {
  const pluginsDir = path.join(__dirname, "..", "src", "plugins");
  if (!fs.existsSync(pluginsDir)) {
    logError(`Plugins directory not found at ${pluginsDir}`);
    return [];
  }

  const plugins = fs.readdirSync(pluginsDir).filter((file) => {
    const pluginPath = path.join(pluginsDir, file);
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
    const activeFilePath = path.join(__dirname, "..", "src", "plugins", plugin, "active");
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
    const activeFilePath = path.join(__dirname, "..", "src", "plugins", plugin, "active");
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
  const returnToMenuOption = `${RED_COLOR}Return to Main Menu${RESET_COLOR}`;

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
 * Wykonuje polecenie systemowe synchronously.
 * @param command Polecenie do wykonania.
 * @param cwd Katalog roboczy.
 */
export function executeCommand(command: string, cwd: string): void {
  try {
    execSync(command, { stdio: "inherit", cwd });
  } catch (error: any) {
    logError(`Error executing command "${command}": ${error.message}`);
    throw error;
  }
}

/**
 * Uruchamia pojedynczy seeder.
 * @param seederPath Ścieżka do pliku seeder.
 * @param projectRoot Katalog główny projektu.
 */
export function runSeeder(seederPath: string, projectRoot: string): void {
  try {
    executeCommand(`npx sequelize-cli db:seed --seed ${seederPath}`, projectRoot);
    logSuccess(`Seeder ${seederPath} został pomyślnie uruchomiony.`);
  } catch (error: any) {
    logError(`Błąd podczas uruchamiania seederu ${seederPath}: ${error.message}`);
    // Możesz zdecydować, czy chcesz kontynuować, czy przerwać proces
  }
}
