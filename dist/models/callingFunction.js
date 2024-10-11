"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_1 = __importDefault(require("../db")); // Upewnij się, że ścieżka do instancji Sequelize jest poprawna
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
    content: {
        type: sequelize_1.DataTypes.JSONB,
        defaultValue: {},
        allowNull: false,
    },
}, {
    sequelize: db_1.default,
    modelName: "CallingFunction",
    timestamps: true, // Automatycznie dodaje createdAt i updatedAt
});
exports.default = CallingFunction;
