"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_1 = __importDefault(require("../db"));
const document_1 = __importDefault(require("./document"));
const file_1 = __importDefault(require("./file"));
class DocumentFile extends sequelize_1.Model {
}
DocumentFile.init({
    documentId: {
        type: sequelize_1.DataTypes.UUID,
        references: {
            model: "Documents",
            key: "id",
        },
        primaryKey: true,
    },
    fileId: {
        type: sequelize_1.DataTypes.UUID,
        references: {
            model: "Files",
            key: "id",
        },
        primaryKey: true,
    },
}, {
    sequelize: db_1.default,
    modelName: "DocumentFile",
    tableName: "DocumentFiles",
    timestamps: false,
});
// Definiowanie relacji między modelami
document_1.default.belongsToMany(file_1.default, { through: DocumentFile, foreignKey: "documentId" });
file_1.default.belongsToMany(document_1.default, { through: DocumentFile, foreignKey: "fileId" });
exports.default = DocumentFile;
