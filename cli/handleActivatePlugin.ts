import fs from "fs";
import path from "path";
import inquirer from "inquirer";
import { execSync } from "child_process";

const GREEN_COLOR = "\x1b[32m";
const RED_COLOR = "\x1b[31m";
const RESET_COLOR = "\x1b[0m";

export async function handleActivatePlugin(): Promise<void> {
  console.log("Activating plugin...");

  const pluginsDir = path.join(__dirname, "..", "src", "plugins");

  if (!fs.existsSync(pluginsDir)) {
    console.error(`Plugins directory not found at ${pluginsDir}`);
    return;
  }

  const plugins = fs.readdirSync(pluginsDir).filter((file) => {
    const pluginPath = path.join(pluginsDir, file);
    return fs.statSync(pluginPath).isDirectory();
  });

  if (plugins.length === 0) {
    console.log("No plugins found in src/plugins.");
    return;
  }

  const inactivePlugins = plugins.filter((plugin) => {
    const activeFilePath = path.join(pluginsDir, plugin, "active");
    return !fs.existsSync(activeFilePath);
  });

  if (inactivePlugins.length === 0) {
    console.log("All plugins are already active.");
    return;
  }

  const returnToMenuOption = `${RED_COLOR}Return to Main Menu${RESET_COLOR}`;

  const choices = [
    { name: returnToMenuOption, value: "Return to Main Menu" },
    ...inactivePlugins.map((plugin) => ({ name: plugin, value: plugin })),
  ];

  const { selectedPlugin }: { selectedPlugin: string } = await inquirer.prompt([
    {
      type: "list",
      name: "selectedPlugin",
      message: "Select a plugin to activate:",
      choices: choices,
    },
  ]);

  if (selectedPlugin === "Return to Main Menu") {
    console.log("Returning to main menu...");
    return;
  }

  const pluginDir = path.join(pluginsDir, selectedPlugin);
  const activeFilePath = path.join(pluginDir, "active");

  // Activate the plugin by creating an 'active' file
  fs.writeFileSync(activeFilePath, "");

  console.log(
    `${GREEN_COLOR}------------------------------------------------------------${RESET_COLOR}`
  );
  console.log(
    `${GREEN_COLOR}Plugin '${selectedPlugin}' has been activated.${RESET_COLOR}`
  );

  // Check if the plugin contains a 'models' subdirectory
  const modelsDir = path.join(pluginDir, "models");
  if (fs.existsSync(modelsDir) && fs.statSync(modelsDir).isDirectory()) {
    console.log(
      `${GREEN_COLOR}Models found in the plugin directory.${RESET_COLOR}`
    );
  }

  console.log(
    `${GREEN_COLOR}------------------------------------------------------------${RESET_COLOR}`
  );

  // If the 'plugins' directory exists, execute 'npm run generate:migrations' synchronously
  const projectRoot = path.join(__dirname, "..");
  const migrationsDir = path.join(projectRoot, "migrations");
  const pluginsRootDir = path.join(projectRoot, "src/plugins"); // Adjust the path as needed

  console.log(`${pluginsRootDir}/${selectedPlugin}`);

  if (
    fs.existsSync(pluginsRootDir) &&
    fs.statSync(pluginsRootDir).isDirectory()
  ) {
    try {
      console.log("Generating migrations...");

      // Capture the list of migration files before generation
      const filesBefore = fs.existsSync(migrationsDir)
        ? fs.readdirSync(migrationsDir)
        : [];

      execSync(`npm run generate:migrations -- ${selectedPlugin}`, {
        stdio: "inherit",
        cwd: projectRoot,
      });
      console.log(
        `${GREEN_COLOR}Migrations generated successfully.${RESET_COLOR}`
      );

      // Capture the list of migration files after generation
      const filesAfter = fs.existsSync(migrationsDir)
        ? fs.readdirSync(migrationsDir)
        : [];

      // Determine the new files by comparing before and after lists
      const newFiles = filesAfter.filter(
        (file) => !filesBefore.includes(file)
      );

      // Filter the files related to the selected plugin
      const pluginFiles = newFiles.filter((file) =>
        file.includes(`create-${selectedPlugin}`)
      );

      if (pluginFiles.length > 0) {
        console.log(`${GREEN_COLOR}Created migration files:${RESET_COLOR}`);
        pluginFiles.forEach((file) => {
          console.log(`${GREEN_COLOR}- ${file}${RESET_COLOR}`);
        });
      } else {
        console.log(
          `${RED_COLOR}No new migration files were created for plugin '${selectedPlugin}'.${RESET_COLOR}`
        );
      }

      // Apply all pending migrations
      console.log(
        `${GREEN_COLOR}Applying all pending migrations...${RESET_COLOR}`
      );

      try {
        execSync(`npx sequelize-cli db:migrate`, {
          stdio: "inherit",
          cwd: projectRoot,
        });
        console.log(
          `${GREEN_COLOR}All pending migrations applied successfully.${RESET_COLOR}`
        );
      } catch (error: any) {
        console.error(
          `${RED_COLOR}Error applying migrations: ${error.message}${RESET_COLOR}`
        );
      }
    } catch (error: any) {
      console.error(
        `${RED_COLOR}Error generating migrations: ${error.message}${RESET_COLOR}`
      );
    }
  } else {
    console.log(
      `${RED_COLOR}Plugins directory does not exist at ${pluginsRootDir}.${RESET_COLOR}`
    );
  }
}
