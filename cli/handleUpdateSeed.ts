import fs from 'fs';
import path from 'path';
import inquirer from 'inquirer';
import { execSync } from 'child_process';

const GREEN_COLOR = '\x1b[32m';
const RED_COLOR = '\x1b[31m';
const RESET_COLOR = '\x1b[0m';

export async function handleUpdateSeed(): Promise<void> {
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
      message: 'Select a plugin to update:',
      choices: choices,
    },
  ]);

  if (selectedPlugin === 'Return to Main Menu') {
    console.log('Returning to main menu...');
    return;
  }

  const pluginDir = path.join(pluginsDir, selectedPlugin);
  
    
  // **New Code Ends Here**

 
}
