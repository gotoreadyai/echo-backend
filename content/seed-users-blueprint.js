'use strict';
const { v4: uuidv4 } = require('uuid');
module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Users', [
      {
        id: uuidv4(),
        email: 'admin@admin.com',
        password: '$2b$10$RvlH24BRriDWaLFvjyTwgOlJcGlblERdC/8gmnY4B1Q2f1OCm5Vxi',
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date()
      },
     
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {});
  }
};
