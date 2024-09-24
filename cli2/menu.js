const { promptMainMenu } = require('./utils/inquirerUtils');
const { managePlugins } = require('./pluginManager');
const { showMigrations } = require('./services/migrations');

function showMainMenu() {
  promptMainMenu()
    .then((answers) => {
      switch (answers.menuOption) {
        case 'About Plugins':
          console.log('This application allows you to manage plugins.');
          showMainMenu();
          break;
        case 'Manage Plugins':
          managePlugins(showMainMenu);
          break;
        case 'Show Migrations':
          showMigrations();
          showMainMenu();
          break;
        case 'Exit':
          console.log('Exiting...');
          process.exit();
          break;
        default:
          console.log('Unknown action.');
          showMainMenu();
      }
    })
    .catch((error) => {
      console.error('Error in main menu:', error);
      process.exit(1);
    });
}

module.exports = { showMainMenu };
