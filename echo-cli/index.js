const inquirer = require("inquirer").default;
const { execSync } = require("child_process");

async function mainMenu() {
  // console.clear();
  const { action } = await inquirer.prompt({
    type: "list",
    name: "action",
    message: "Select an action:",
    choices: [
      { name: "About", value: "about" },
      { name: "Plugins", value: "plugins" },
      { name: "Setup", value: "setup" }, // Nowa opcja setup
      { name: "Exit", value: "exit" },
    ],
  });

  try {
    switch (action) {
      case "about":
        execSync('echo "┏\n┃ SmartInteractive CLI v.0.0.1\n╹" ', {
          stdio: "inherit",
        });
        break;
      case "plugins":
        execSync("node ./echo-cli/plugins.js", { stdio: "inherit" });
        break;
      case "setup":
        execSync("node ./echo-cli/setup.js", { stdio: "inherit" }); // Uruchomienie setup.js
        break;
      case "exit":
        process.exit(0);
        break;
    }
  } catch (error) {
    console.error(
      "Error occurred:",
      error.stderr ? error.stderr.toString() : error.message
    );
  }

  await mainMenu(); // Powrót do menu głównego po wykonaniu akcji
}

mainMenu();
