import fs from 'fs';
import path from 'path';
import inquirer from 'inquirer';
import { execSync } from 'child_process';

const GREEN_COLOR = '\x1b[32m';
const RED_COLOR = '\x1b[31m';
const RESET_COLOR = '\x1b[0m';

export async function handleDeactivatePlugin(): Promise<void> {
  console.log('Deactivating plugin...');

  const pluginsDir = path.join(__dirname, '..', 'src', 'plugins');

  if (!fs.existsSync(pluginsDir)) {
    console.error(`Plugins directory not found at ${pluginsDir}`);
    return;
  }

  const plugins = fs.readdirSync(pluginsDir).filter((file) => {
    const pluginPath = path.join(pluginsDir, file);
    return fs.statSync(pluginPath).isDirectory();
  });

  if (plugins.length === 0) {
    console.log('No plugins found in src/plugins.');
    return;
  }

  const activePlugins = plugins.filter((plugin) => {
    const activeFilePath = path.join(pluginsDir, plugin, 'active');
    return fs.existsSync(activeFilePath);
  });

  if (activePlugins.length === 0) {
    console.log('No active plugins to deactivate.');
    return;
  }

  const returnToMenuOption = `${RED_COLOR}Return to Main Menu${RESET_COLOR}`;

  const choices = [
    { name: returnToMenuOption, value: 'Return to Main Menu' },
    ...activePlugins.map((plugin) => ({ name: plugin, value: plugin })),
  ];

  const { selectedPlugin }: { selectedPlugin: string } = await inquirer.prompt([
    {
      type: 'list',
      name: 'selectedPlugin',
      message: 'Select a plugin to deactivate:',
      choices: choices,
    },
  ]);

  if (selectedPlugin === 'Return to Main Menu') {
    console.log('Returning to main menu...');
    return;
  }

  const pluginDir = path.join(pluginsDir, selectedPlugin);
  const activeFilePath = path.join(pluginDir, 'active');

  // **New Code Starts Here**
  // Undo the migrations associated with the plugin
  try {
    const projectRoot = path.join(__dirname, '..');
    const migrationsDir = path.join(projectRoot, 'migrations');

    // Get the list of migration files for the plugin
    const allMigrationFiles = fs.existsSync(migrationsDir)
      ? fs.readdirSync(migrationsDir)
      : [];

    // Filter migration files related to the selected plugin
    const pluginMigrationFiles = allMigrationFiles.filter((file) =>
      file.includes(`create-${selectedPlugin}`)
    );

    if (pluginMigrationFiles.length > 0) {
      // Sort the migrations in reverse order to undo them properly
      pluginMigrationFiles.sort().reverse();

      console.log(
        `${GREEN_COLOR}Undoing migrations for plugin '${selectedPlugin}'...${RESET_COLOR}`
      );

      for (const migrationFile of pluginMigrationFiles) {
        console.log(`Undoing migration: ${migrationFile}`);
        // Undo the migration
        execSync(
          `npx sequelize-cli db:migrate:undo --name ${migrationFile}`,
          { stdio: 'inherit', cwd: projectRoot }
        );
      }

      console.log(
        `${GREEN_COLOR}Migrations for plugin '${selectedPlugin}' have been undone.${RESET_COLOR}`
      );

      // **New Code for Deleting Migration Files**
      // Delete the migration files associated with the plugin
      console.log(
        `${GREEN_COLOR}Deleting migration files for plugin '${selectedPlugin}'...${RESET_COLOR}`
      );

      for (const migrationFile of pluginMigrationFiles) {
        const migrationFilePath = path.join(migrationsDir, migrationFile);
        if (fs.existsSync(migrationFilePath)) {
          fs.unlinkSync(migrationFilePath);
          console.log(`Deleted migration file: ${migrationFile}`);
        } else {
          console.log(`Migration file not found: ${migrationFile}`);
        }
      }

      console.log(
        `${GREEN_COLOR}Migration files for plugin '${selectedPlugin}' have been deleted.${RESET_COLOR}`
      );
    } else {
      console.log(
        `${RED_COLOR}No migrations found for plugin '${selectedPlugin}'.${RESET_COLOR}`
      );
    }
  } catch (error: any) {
    console.error(
      `${RED_COLOR}Error undoing migrations: ${error.message}${RESET_COLOR}`
    );
    return;
  }
  // **New Code Ends Here**

  // Deactivate the plugin by removing the 'active' file
  fs.unlinkSync(activeFilePath);

  console.log(
    `${GREEN_COLOR}------------------------------------------------------------${RESET_COLOR}`
  );
  console.log(
    `${GREEN_COLOR}Plugin '${selectedPlugin}' has been deactivated.${RESET_COLOR}`
  );
  console.log(
    `${GREEN_COLOR}------------------------------------------------------------${RESET_COLOR}`
  );
}
