"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_1 = __importDefault(require("../db")); // Upewnij się, że ścieżka do instancji Sequelize jest poprawna
const user_1 = __importDefault(require("./user"));
class CallingFunction extends sequelize_1.Model {
}
CallingFunction.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
    },
    title: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    slug: {
        type: sequelize_1.DataTypes.STRING,
    },
    description: {
        type: sequelize_1.DataTypes.STRING,
    },
    response: {
        type: sequelize_1.DataTypes.JSONB,
        defaultValue: {},
    },
    parameters: {
        type: sequelize_1.DataTypes.JSONB,
        defaultValue: {},
    },
    systemMessage: {
        type: sequelize_1.DataTypes.STRING,
    },
    userMessage: {
        type: sequelize_1.DataTypes.STRING,
    },
    plugin: {
        type: sequelize_1.DataTypes.STRING,
    },
    ownerId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
    },
}, {
    sequelize: db_1.default,
    modelName: "CallingFunction",
    timestamps: true, // Automatycznie dodaje createdAt i updatedAt
});
// Relacja z modelem User
CallingFunction.belongsTo(user_1.default, { foreignKey: "ownerId", as: "owner" });
exports.default = CallingFunction;
