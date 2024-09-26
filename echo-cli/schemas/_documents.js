"use strict";
const { v4: uuidv4 } = require("uuid");
const records = [];

const recordFormatter = (item, ownerId, workspaceId) => {
  return {
    ...item.data,
    content: JSON.stringify(item.data.content),
    id: uuidv4(),
    ownerId, 
    workspaceId, 
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
      const [workspaces] = await queryInterface.sequelize.query(
        `SELECT id FROM "Workspaces" WHERE slug = '${item.workspaceSlug}';`
      );

      if (workspaces.length === 0) {
        throw new Error(`Workspace with slug '${item.workspaceSlug}' not found`);
      }

      const workspaceId = workspaces[0].id;

      return recordFormatter(item, adminId, workspaceId);
    });

    // Poczekaj na wszystkie Promisy, aby uzyskać sformatowane rekordy
    const formattedRecords = await Promise.all(formattedRecordsPromises);

    // Wstaw sformatowane rekordy do tabeli "Documents"
    return queryInterface.bulkInsert("Documents", formattedRecords, {});
  },

  down: async (queryInterface, Sequelize) => {
    // Opcja 1: Usunięcie na podstawie unikalnych właściwości
    // Załóżmy, że wszystkie dokumenty wstawione przez ten seeder mają tego samenego ownerId
    const [users] = await queryInterface.sequelize.query(
      `SELECT id FROM "Users" WHERE email = 'admin@admin.com';`
    );

    if (users.length === 0) {
      throw new Error("Admin user not found");
    }

    const adminId = users[0].id;

    // Usuń tylko dokumenty przypisane do admina i mające określone workspaceSlug
    // Zakładamy, że workspaceSlugi są unikalne
    const workspaceSlugs = records.map(record => record.data.workspaceSlug);
    
    const workspaces = await queryInterface.sequelize.query(
      `SELECT id FROM "Workspaces" WHERE slug IN (${workspaceSlugs.map(slug => `'${slug}'`).join(", ")});`
    );

    const workspaceIds = workspaces[0].map(ws => ws.id);

    return queryInterface.bulkDelete("Documents", {
      ownerId: adminId,
      workspaceId: workspaceIds,
      // Opcjonalnie możesz dodać dodatkowe warunki, np. na podstawie zawartości
    }, {});
  },
};
