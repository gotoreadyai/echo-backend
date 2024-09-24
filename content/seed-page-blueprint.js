"use strict";
const path = require("path");
const pluralize = require("pluralize");
const { v4: uuidv4 } = require("uuid");
const config = require(path.resolve(
  __dirname,
  "../config/generatorsconfig.json"
));
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const [users] = await queryInterface.sequelize.query(
      `SELECT id from "Users" WHERE email = 'admin@admin.com';`
    );
    return queryInterface.bulkInsert(
      "Documents",
      [
        {
          id: "`id1`",
          workspaceId:"`workspaceId`",
          title: "`prular`",
          slug: "`prular`",
          content: JSON.stringify(`content-page`),
          ownerId: users[0].id,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Documents", null, {});
  },
};
