const inquirer = require("inquirer").default;
const { execSync } = require("child_process");
const cmdService = require("./services/commandService");
const { msg } = require("./utils/messages");
const { showTopBar, clearTopBar } = require("./services/topBarService");
const fs = require("fs");
const path = require("path");

// Funkcja do usuwania plików migracyjnych
function clearMigrationsDirectory() {
  const migrationsDir = path.join(__dirname, "../migrations");

  try {
    const files = fs.readdirSync(migrationsDir);

    if (files.length === 0) {
      console.log("Brak plików do usunięcia w katalogu 'migrations'.");
      return;
    }

    files.forEach((file) => {
      const filePath = path.join(migrationsDir, file);
      console.log(`Usuwanie pliku: ${filePath}`);
      fs.unlinkSync(filePath);
      console.log(`Plik ${file} został usunięty.`);
    });

    console.log("Wszystkie pliki migracyjne zostały usunięte.");
  } catch (err) {
    if (err.code === "ENOENT") {
      console.log(
        "Katalog 'migrations' nie został znaleziony, pomijam czyszczenie."
      );
    } else {
      console.error("Błąd podczas usuwania plików migracyjnych:", err);
    }
  }
}

// Funkcja do wycofywania migracji
async function dropTables() {
  try {
    showTopBar("Wycofywanie wszystkich migracji...");
    const dropCmd = "npx sequelize-cli db:migrate:undo:all";
    const statusDrop = cmdService.runCmd(dropCmd);
    clearTopBar();

    if (statusDrop === 0) {
      console.log(
        "Wszystkie tabele zostały wycofane pomyślnie przy użyciu Sequelize CLI."
      );
      // Usunięcie plików migracyjnych po wycofaniu tabel
      clearMigrationsDirectory();
      return 0; // Sukces
    } else {
      console.error("Nie udało się wycofać tabel przy użyciu Sequelize CLI.");
      return 1; // Błąd
    }
  } catch (error) {
    console.error("Wystąpił błąd podczas wycofywania tabel:", error);
    return 1; // Błąd
  }
}

// Funkcja do generowania i uruchamiania migracji
async function initializeDatabase() {
  // Krok 1: Generowanie nowych plików migracyjnych
  showTopBar("Generowanie nowych plików migracyjnych...");
  const generateCmd = "npm run generate:migrations";
  const statusGenerate = cmdService.runCmd(generateCmd);
  clearTopBar();

  if (statusGenerate === 0) {
    msg.exeOK("Wygenerowano pliki migracyjne");

    // Krok 2: Uruchomienie nowych migracji
    showTopBar("Uruchamianie migracji...");
    const migrateCmd = "npx sequelize-cli db:migrate";
    const statusMigrate = cmdService.runCmd(migrateCmd);
    clearTopBar();

    if (statusMigrate === 0) {
      msg.exeOK("initdb");
      console.log("Migracje zostały pomyślnie uruchomione.");
    } else {
      msg.exeBAD("initdb");
      console.error("Nie udało się uruchomić migracji.");
    }
  } else {
    msg.exeBAD("Nie udało się wygenerować plików migracyjnych");
    console.error("Nie udało się wygenerować plików migracyjnych.");
  }
}

// Główna funkcja menu konfiguracji
async function setupMenu() {
  const { setupAction } = await inquirer.prompt({
    type: "list",
    name: "setupAction",
    message: "Wybierz opcję konfiguracji:",
    choices: [
      { name: "Utwórz Super Admina", value: "createSuperAdmin" },
      { name: "Zainicjuj Bazę Danych", value: "initdb" }, // Opcja initdb
    ],
  });

  try {
    switch (setupAction) {
      case "createSuperAdmin":
        showTopBar("Tworzenie Super Admina...");
        execSync('echo "Tworzenie Super Admina..."', {
          stdio: "inherit",
        });
        clearTopBar();
        msg.exeOK("createSuperAdmin");
        break;

      case "initdb":
        // Krok 1: Wycofanie wszystkich migracji i usunięcie plików migracyjnych
        const dropStatus = await dropTables();

        if (dropStatus === 0) {
          // Krok 2: Generowanie nowych plików migracyjnych i uruchamianie migracji
          await initializeDatabase();
        } else {
          msg.exeBAD(
            "Wycofywanie migracji zakończyło się niepowodzeniem. Przerywanie procesu."
          );
        }
        break;
    }
  } catch (error) {
    console.error(
      "Wystąpił błąd:",
      error.stderr ? error.stderr.toString() : error.message
    );
  }
}

// Uruchomienie menu konfiguracji
setupMenu();
