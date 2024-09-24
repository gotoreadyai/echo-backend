#!/usr/bin/env node

import inquirer from 'inquirer';
import fs from 'fs';
import path from 'path';
import { handleConfig } from './cli/handleConfig';
import { handleLoadPlugin } from './cli/handleLoadPlugin';
import { handleActivatePlugin } from './cli/handleActivatePlugin';
import { handleDeactivatePlugin } from './cli/handleDeactivatePlugin';

(async () => {
  // Wyczyść konsolę
  console.clear();

  let continueLoop = true;

  while (continueLoop) {
    try {
      // Sprawdzenie zawartości katalogu src/migrations
      const migrationsDir = path.resolve(__dirname, 'migrations');
      let isMigrationsEmpty = true;

      if (fs.existsSync(migrationsDir)) {
        const files = fs.readdirSync(migrationsDir);
        isMigrationsEmpty = files.length === 0;
      }

      // Dynamiczne ustawianie opcji menu
      const choices = isMigrationsEmpty
        ? ['SETUP!', new inquirer.Separator(), 'Exit']
        : [
            'SETUP!',
            'loadPlugin',
            'activatePlugin',
            'deactivatePlugin',
            new inquirer.Separator(),
            'Exit',
          ];

      const { action }: { action: string } = await inquirer.prompt([
        {
          type: 'list',
          name: 'action',
          message: 'Choose an action:',
          choices,
        },
      ]);

      if (action === 'Exit') {
        continueLoop = false;
        console.log('Goodbye!');
        break;
      }

      switch (action) {
        case 'SETUP!':
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
