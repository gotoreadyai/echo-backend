"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_1 = __importDefault(require("../db"));
const user_1 = __importDefault(require("./user"));
class Workspace extends sequelize_1.Model {
}
Workspace.init({
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
    ownerId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
    },
}, {
    sequelize: db_1.default,
    modelName: 'Workspace',
});
// Relacja z modelem User
Workspace.belongsTo(user_1.default, { foreignKey: "ownerId", as: "owner" });
exports.default = Workspace;
