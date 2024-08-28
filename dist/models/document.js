"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_1 = __importDefault(require("../db"));
const workspace_1 = __importDefault(require("./workspace"));
const user_1 = __importDefault(require("./user"));
class Document extends sequelize_1.Model {
}
Document.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
    },
    title: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    content: {
        type: sequelize_1.DataTypes.JSONB,
        defaultValue: {},
        allowNull: false,
    },
    workspaceId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
        references: {
            model: "Workspaces", // Nazwa tabeli do której odnosi się klucz obcy
            key: "id",
        },
        onDelete: "CASCADE", // Opcjonalnie: co zrobić, gdy workspace jest usuwany
    },
    ownerId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
    },
}, {
    sequelize: db_1.default,
    modelName: "Document",
});
// Relacja z modelem User
Document.belongsTo(user_1.default, { foreignKey: "ownerId", as: "owner" });
// Poprawione relacje
workspace_1.default.hasMany(Document, { foreignKey: "workspaceId" });
Document.belongsTo(workspace_1.default, { foreignKey: "workspaceId" });
exports.default = Document;
