// ------ cli/commands/runMigration.ts ------

import { logSuccess, logError } from "../utils/logging";
import { runMigration } from "./runSeeder";

export function runMigrationCommand(): void {
  try {
    logSuccess("Uruchamianie migracji...");
    runMigration(process.cwd());
    logSuccess("Migracje zostały pomyślnie uruchomione.");
  } catch (error: any) {
    logError(`Błąd podczas uruchamiania migracji: ${error.message}`);
  }
}

