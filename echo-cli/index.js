const inquirer = require("inquirer").default;
const { execSync } = require("child_process");

async function mainMenu() {
  console.clear();
  const { action } = await inquirer.prompt({
    type: "list",
    name: "action",
    message: "Select an action:",
    choices: [
      { name: "About", value: "about" },
      { name: "Plugins", value: "plugins" },
      { name: "Exit", value: "exit" },
    ],
  });

  try {
    switch (action) {
      case "about":
        console.clear(); 
        execSync('echo "This is the CLI tool for managing plugins."', {
          stdio: "inherit",
        });
        
        break;
      case "plugins":
        execSync("node ./echo-cli/plugins.js", { stdio: "inherit" }); 
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
