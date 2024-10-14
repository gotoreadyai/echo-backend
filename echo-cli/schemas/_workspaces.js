"use strict";
const { v4: uuidv4 } = require("uuid");
const records = [];
const plugin = "";

const recordFormatter = (item, ownerId) => {
  return {
    ...item.data,
    content: JSON.stringify(item.data.content),
    id: uuidv4(),
    ownerId, 
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Pobierz ID użytkownika admina
    const [users] = await queryInterface.sequelize.query(
      `SELECT id FROM "Users" WHERE email = 'admin@admin.com';`
    );
    if (users.length === 0) {
      throw new Error("Admin user not found");
    }
    const adminId = users[0].id;
    const formattedRecordsPromises = records.map(async (item) => {
      return recordFormatter(item, adminId);
    });
    const formattedRecords = await Promise.all(formattedRecordsPromises);
    return queryInterface.bulkInsert("Workspaces", formattedRecords, {});
  },

  down: async (queryInterface, Sequelize) => {
    const [users] = await queryInterface.sequelize.query(
      `SELECT id FROM "Users" WHERE email = 'admin@admin.com';`
    );
    if (users.length === 0) {
      throw new Error("Admin user not found");
    }
    const adminId = users[0].id;
    return queryInterface.bulkDelete("Workspaces", {
      ownerId: adminId,
    }, {});
  },
};
