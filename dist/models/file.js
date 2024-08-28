"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_1 = __importDefault(require("../db"));
const document_1 = __importDefault(require("./document"));
class File extends sequelize_1.Model {
}
File.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
    },
    name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    type: sequelize_1.DataTypes.STRING,
    url: sequelize_1.DataTypes.STRING,
}, {
    sequelize: db_1.default,
    modelName: "File",
});
document_1.default.belongsToMany(File, { through: "DocumentFile" });
File.belongsToMany(document_1.default, { through: "DocumentFile" });
exports.default = File;
