#!/usr/bin/env node

import inquirer from 'inquirer';
import { handleConfig } from './cli/handleConfig';
import { handleLoadPlugin } from './cli/handleLoadPlugin';
import { handleActivatePlugin } from './cli/handleActivatePlugin';
import { handleDeactivatePlugin } from './cli/handleDeactivatePlugin';

(async () => {
  let continueLoop = true;

  while (continueLoop) {
    try {
      const { action }: { action: string } = await inquirer.prompt([
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
