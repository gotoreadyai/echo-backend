"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_1 = __importDefault(require("../db"));
class DocumentCategory extends sequelize_1.Model {
}
DocumentCategory.init({
    documentId: {
        type: sequelize_1.DataTypes.UUID,
        references: {
            model: 'Documents',
            key: 'id'
        },
        primaryKey: true
    },
    categoryId: {
        type: sequelize_1.DataTypes.UUID,
        references: {
            model: 'Categories',
            key: 'id'
        },
        primaryKey: true
    }
}, {
    sequelize: db_1.default,
    modelName: 'DocumentCategory',
    tableName: 'DocumentCategories' // Określenie nazwy tabeli
});
exports.default = DocumentCategory;
