// ------ cli/handleConfig.ts ------
import fs from "fs";
import path from "path";
import { 
  logSuccess, 
  logError, 
  executeCommand,
  runSeeder 
} from "./utils";

export async function handleConfig(): Promise<void> {
  const projectRoot = path.resolve(__dirname, "..");
  const migrationsDir = path.join(projectRoot, "migrations");
  const seedersDir = path.join(projectRoot, "seeders");
  const initSeedersFile = path.join(projectRoot, "cli", "initSeeders.md");

  logSuccess(`Project Root: ${projectRoot}`);

  try {
    // 1. Cofnięcie wszystkich migracji
    logSuccess("Cofanie wszystkich zastosowanych migracji...");
    executeCommand(`npx sequelize-cli db:migrate:undo:all`, projectRoot);
    logSuccess("Wszystkie migracje zostały cofnięte.");

    // 2. Wyczyszczenie katalogu migracji
    if (fs.existsSync(migrationsDir)) {
      fs.readdirSync(migrationsDir).forEach((file) => {
        const filePath = path.join(migrationsDir, file);
        fs.unlinkSync(filePath);
      });
      logSuccess("Katalog migracji został wyczyszczony.");
    } else {
      fs.mkdirSync(migrationsDir);
      logSuccess("Katalog migracji został utworzony.");
    }

    logSuccess("Generowanie migracji...");
    executeCommand(`npm run generate:migrations`, projectRoot);
    logSuccess("Migracje zostały pomyślnie wygenerowane.");

    // 3. Zastosowanie nowych migracji
    logSuccess("Stosowanie wszystkich pending migracji...");
    executeCommand(`npx sequelize-cli db:migrate`, projectRoot);
    logSuccess("Wszystkie pending migracje zostały pomyślnie zastosowane.");

    // 4. Wyczyszczenie katalogu seederów
    if (fs.existsSync(seedersDir)) {
      fs.readdirSync(seedersDir).forEach((file) => {
        const filePath = path.join(seedersDir, file);
        fs.unlinkSync(filePath);
      });
      logSuccess("Katalog seederów został wyczyszczony.");
    } else {
      fs.mkdirSync(seedersDir);
      logSuccess("Katalog seederów został utworzony.");
    }

    // 5. Generowanie seederów i uruchamianie ich zaraz po generacji
    if (fs.existsSync(initSeedersFile)) {
      logSuccess("Ładowanie pliku initSeeders.md...");

      // Wczytanie poleceń z initSeeders.md
      const seedersCommands = fs
        .readFileSync(initSeedersFile, "utf-8")
        .split("\n")
        .map(line => line.trim())
        .filter(line => line && !line.startsWith("#")); // Ignoruj puste linie i komentarze

      for (const command of seedersCommands) {
        logSuccess(`Wykonywanie: ${command}`);

        try {
          executeCommand(command, projectRoot);
          logSuccess(`Polecenie "${command}" zostało wykonane.`);
        } catch (cmdError: any) {
          logError(`Błąd podczas wykonywania polecenia "${command}": ${cmdError.message}`);
          continue; // Kontynuuj z kolejnymi poleceniami
        }

        

        // Zakładam, że polecenie generuje nowe pliki seeder w katalogu seederów
        // Możemy porównać z wcześniejszą listą, ale w tej refaktoryzacji, po wyczyszczeniu katalogu, każde polecenie powinno generować jeden seeder
        // Dlatego możemy zakładać, że ostatnio zmodyfikowany plik to nowo utworzony seeder

        // Pobierz listę seederów po wykonaniu polecenia
        const updatedSeeders = fs.readdirSync(seedersDir);
        if (updatedSeeders.length === 0) {
          logError(`Nie wygenerowano żadnych seederów po poleceniu "${command}".`);
          continue;
        }

        // Zakładam, że polecenie generuje jeden seeder na raz
        // Znajdź najnowszy plik
        const seederFiles = updatedSeeders
          .filter(file => file.endsWith(".js"))
          .map(file => ({
            name: file,
            time: fs.statSync(path.join(seedersDir, file)).mtime.getTime()
          }))
          .sort((a, b) => b.time - a.time);

        const newestSeeder = seederFiles[0]?.name;

        if (newestSeeder) {
          const seederPath = path.join(seedersDir, newestSeeder);
          logSuccess(`Uruchamianie seederu: ${newestSeeder}...`);
          runSeeder(seederPath, projectRoot);
        } else {
          logError(`Nie można znaleźć nowego seederu po poleceniu "${command}".`);
        }
      }

      logSuccess("Wszystkie seedery zostały pomyślnie wygenerowane i uruchomione.");
    } else {
      logError("Plik initSeeders.md nie został znaleziony.");
    }

  } catch (error: any) {
    logError(`Błąd podczas migracji lub seederów: ${error.message}`);
  }
}
