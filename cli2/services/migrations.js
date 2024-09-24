const { exec } = require('child_process');

function showMigrations() {
  exec('npx sequelize-cli db:migrate:status', (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing migrations: ${error}`);
      return;
    }
    console.log(`Migrations:\n${stdout}`);
  });
}

module.exports = { showMigrations };
