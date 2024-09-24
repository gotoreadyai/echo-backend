"use strict";
const { v4: uuidv4 } = require('uuid');
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const [users] = await queryInterface.sequelize.query(
      `SELECT id from "Users" WHERE email = 'admin@admin.com';`
    );

    return queryInterface.bulkInsert(
      "Workspaces",
      [
        {
          id: "3db090d8-6f6b-436e-8437-11e29ef1be11",
          title: "Dashboard",
          slug: "dashboard",
          content: JSON.stringify({
            footer: [
              {
                id:uuidv4(),
                data: { text: "This is the footer content." },
                filename: "Paragraph",
              },
            ],
            header: [
              {
                id: uuidv4(),
                data: {
                  to: "/dashboard/headpage/",
                  name: "Dashboard",
                  className: "px-sm font-bold",
                },
                filename: "Link",
              },
              {
                id: uuidv4(),
                data: {
                  to: "/dashboard/workspaces/",
                  name: "Workspaces",
                  className: "px-sm font-bold",
                },
                filename: "Link",
              },
            ],
            _pageData: {
              layout: "MainDashboard",
              filters: {},
              document: {},
              documents: {},
              workspace: {},
              workspaces: [],
            },
            _sideStatic: [
              {
                id: uuidv4(),
                data: {
                  to: "/dashboard/workspaces/",
                  name: "Workspaces",
                  wide:true
                },
                filename: "Link",
              },
              {
                id: uuidv4(),
                data: {
                  to: "/dashboard/documents/",
                  name: "Documents",
                  wide:true
                },
                filename: "Link",
              },
            ],
          }),
          ownerId: users[0].id,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: "22bc8312-2370-4928-81aa-7860aee58ebc",
          title: "Authentication",
          slug: "authentication",
          content: JSON.stringify({ _pageData: { layout: "MainDashboard" } }),
          ownerId: users[0].id,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: "0df43c96-7ad6-4ca4-8a47-47661e2947df",
          title: "Home",
          slug: "home",
          content: JSON.stringify({"_pageData":{"layout":"MainDashboard"}}),
          ownerId: users[0].id,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Workspaces", null, {});
  },
};
