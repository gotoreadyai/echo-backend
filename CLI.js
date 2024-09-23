#!/usr/bin/env node

const inquirer = require('inquirer').default;
const fs = require('fs');
const path = require('path');

// Definiowanie kodów ANSI dla kolorów
const GREEN_COLOR = '\x1b[32m';
const RED_COLOR = '\x1b[31m';
const RESET_COLOR = '\x1b[0m';

(async () => {
  let continueLoop = true;

  while (continueLoop) {
    try {
      const { action } = await inquirer.prompt([
        {
          type: 'list',
          name: 'action',
          message: 'Choose an action:',
          choices: [
            'config',
            'loadPlugin',
            'activatePlugin',
            'deactivatePlugin',
            new inquirer.Separator(),
            'Exit',
          ],
        },
      ]);

      if (action === 'Exit') {
        continueLoop = false;
        console.log('Goodbye!');
        break;
      }

      switch (action) {
        case 'config':
          await handleConfig();
          break;
        case 'loadPlugin':
          await handleLoadPlugin();
          break;
        case 'activatePlugin':
          await handleActivatePlugin();
          break;
        case 'deactivatePlugin':
          await handleDeactivatePlugin();
          break;
        default:
          console.log('Invalid action selected.');
      }
    } catch (error) {
      console.error('An error occurred:', error);
      continueLoop = false;
    }
  }
})();

// Definicje funkcji

async function handleConfig() {
  console.log('You chose to configure settings.');
  // Dodaj tutaj logikę konfiguracji
}

async function handleLoadPlugin() {
  console.log('You chose to load a plugin.');
  // Dodaj tutaj logikę ładowania wtyczki
}

async function handleActivatePlugin() {
  console.log('Activating plugin...');

  const pluginsDir = path.join(__dirname, 'src', 'plugins');

  // Sprawdź, czy katalog wtyczek istnieje
  if (!fs.existsSync(pluginsDir)) {
    console.error(`Plugins directory not found at ${pluginsDir}`);
    return;
  }

  // Odczytaj wszystkie katalogi wtyczek
  const plugins = fs.readdirSync(pluginsDir).filter((file) => {
    const pluginPath = path.join(pluginsDir, file);
    return fs.statSync(pluginPath).isDirectory();
  });

  if (plugins.length === 0) {
    console.log('No plugins found in src/plugins.');
    return;
  }

  // Filtruj wtyczki, które nie mają pliku 'active'
  const inactivePlugins = plugins.filter((plugin) => {
    const activeFilePath = path.join(pluginsDir, plugin, 'active');
    return !fs.existsSync(activeFilePath);
  });

  if (inactivePlugins.length === 0) {
    console.log('All plugins are already active.');
    return;
  }

  // Pokoloruj opcję 'Return to Main Menu' na czerwono
  const returnToMenuOption = `${RED_COLOR}Return to Main Menu${RESET_COLOR}`;

  // Dodaj pokolorowaną opcję 'Return to Main Menu'
  const choices = [
    { name: returnToMenuOption, value: 'Return to Main Menu' },
    ...inactivePlugins.map((plugin) => ({ name: plugin, value: plugin })),
  ];

  // Pozwól użytkownikowi wybrać wtyczkę do aktywacji
  const { selectedPlugin } = await inquirer.prompt([
    {
      type: 'list',
      name: 'selectedPlugin',
      message: 'Select a plugin to activate:',
      choices: choices,
    },
  ]);

  if (selectedPlugin === 'Return to Main Menu') {
    console.log('Returning to main menu...');
    return;
  }

  const activeFilePath = path.join(pluginsDir, selectedPlugin, 'active');

  // Utwórz plik 'active' w wybranym katalogu wtyczki
  fs.writeFileSync(activeFilePath, '');

  // Pokoloruj komunikat o aktywacji na zielono używając kodów ANSI
  console.log(
    `${GREEN_COLOR}------------------------------------------------------------${RESET_COLOR}`
  );
  console.log(
    `${GREEN_COLOR}Plugin '${selectedPlugin}' has been activated.${RESET_COLOR}`
  );
  console.log(
    `${GREEN_COLOR}------------------------------------------------------------${RESET_COLOR}`
  );
}

async function handleDeactivatePlugin() {
  console.log('Deactivating plugin...');

  const pluginsDir = path.join(__dirname, 'src', 'plugins');

  // Sprawdź, czy katalog wtyczek istnieje
  if (!fs.existsSync(pluginsDir)) {
    console.error(`Plugins directory not found at ${pluginsDir}`);
    return;
  }

  // Odczytaj wszystkie katalogi wtyczek
  const plugins = fs.readdirSync(pluginsDir).filter((file) => {
    const pluginPath = path.join(pluginsDir, file);
    return fs.statSync(pluginPath).isDirectory();
  });

  if (plugins.length === 0) {
    console.log('No plugins found in src/plugins.');
    return;
  }

  // Filtruj wtyczki, które mają plik 'active'
  const activePlugins = plugins.filter((plugin) => {
    const activeFilePath = path.join(pluginsDir, plugin, 'active');
    return fs.existsSync(activeFilePath);
  });

  if (activePlugins.length === 0) {
    console.log('No active plugins to deactivate.');
    return;
  }

  // Pokoloruj opcję 'Return to Main Menu' na czerwono
  const returnToMenuOption = `${RED_COLOR}Return to Main Menu${RESET_COLOR}`;

  // Dodaj pokolorowaną opcję 'Return to Main Menu'
  const choices = [
    { name: returnToMenuOption, value: 'Return to Main Menu' },
    ...activePlugins.map((plugin) => ({ name: plugin, value: plugin })),
  ];

  // Pozwól użytkownikowi wybrać wtyczkę do dezaktywacji
  const { selectedPlugin } = await inquirer.prompt([
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

  const activeFilePath = path.join(pluginsDir, selectedPlugin, 'active');

  // Usuń plik 'active' z wybranego katalogu wtyczki
  fs.unlinkSync(activeFilePath);

  // Pokoloruj komunikat o dezaktywacji na zielono używając kodów ANSI
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
