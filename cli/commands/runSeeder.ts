// ------ cli/commands/runSeeder.ts ------
import { runSeeder } from "../services/pluginService";
import { logSuccess, logError } from "../utils/logging";

/**
 * Command to run database seeders.
 */
export function runSeederCommand(): void {
  try {
    const seederPath = "20230924_initial_seeder.ts"; // Możesz dostosować lub dynamicznie ustalać tę wartość
    const projectRoot = process.cwd(); // Aktualny katalog roboczy

    logSuccess("Uruchamianie seederów...");
    runSeeder(seederPath, projectRoot);
    logSuccess("Seeder został pomyślnie uruchomiony.");
  } catch (error: any) {
    logError(`Błąd podczas uruchamiania seederu: ${error.message}`);
  }
}
