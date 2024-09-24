// ------ cli/utils/commandExecutor.ts ------
import { execSync } from "child_process";
import { logError, logSuccess } from "./logging";

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
