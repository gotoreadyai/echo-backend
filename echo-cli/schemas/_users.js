"use strict";
const { v4: uuidv4 } = require("uuid");
const records = [];

const record = (record) => {
  return {
    ...record.data,
    id: uuidv4(),
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      "Users",
      records.map((item) => record(item)), // Zmiana nazwy parametru na 'item'
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Users", null, {});
  },
};
