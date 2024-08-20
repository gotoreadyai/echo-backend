"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const dotenv_1 = __importDefault(require("dotenv"));
// Load environment variables from .env file
dotenv_1.default.config();
const sequelize = new sequelize_1.Sequelize(process.env.DB_NAME || "default_db", process.env.DB_USER || "default_user", process.env.DB_PASSWORD || "default_password", {
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT) || 5432,
    dialect: "postgres",
    logging: false,
});
exports.default = sequelize;
