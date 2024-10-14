"use strict";
const { v4: uuidv4 } = require("uuid");
const records = [];
const plugin = "";

const recordFormatter = (item, ownerId) => {
  console.log("ownerId", ownerId);
  return {
    id: uuidv4(),
    title: item.data.title,
    function: JSON.stringify(item.data.function),
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

    // Formatowanie rekordów z asynchronicznymi zapytaniami
    const formattedRecordsPromises = records.map(async (item) => {
      return recordFormatter(item, adminId);
    });

    // Poczekaj na wszystkie Promisy, aby uzyskać sformatowane rekordy
    const formattedRecords = await Promise.all(formattedRecordsPromises);

    // Wstaw sformatowane rekordy do tabeli "Documents"
    return queryInterface.bulkInsert("CallingFunctions", formattedRecords, {});
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("CallingFunctions", null, {});
  },
};
