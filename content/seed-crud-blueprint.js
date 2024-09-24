"use strict";
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
          title: "`prular`",
          slug: "`prular`",
          content: JSON.stringify(`content-list`),
          workspaceId:"`workspaceId`",
          ownerId: users[0].id,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: "`id2`",
          title: "`singular` edit",
          slug: "`singular`-edit",
          content: JSON.stringify(`content-edit`),
          workspaceId:"`workspaceId`",
          ownerId: users[0].id,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: "`id3`",
          title: "`singular` create",
          slug: "`singular`-create",
          content: JSON.stringify(`content-create`),
          workspaceId:"`workspaceId`",
          ownerId: users[0].id,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: "`id4`",
          title: "`singular` delete",
          slug: "`singular`-delete",
          content: JSON.stringify(`content-delete`),
          workspaceId:"`workspaceId`",
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
