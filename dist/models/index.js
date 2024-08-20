"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentCategory = exports.Category = exports.Document = void 0;
const document_1 = __importDefault(require("./document"));
exports.Document = document_1.default;
const category_1 = __importDefault(require("./category"));
exports.Category = category_1.default;
const documentCategory_1 = __importDefault(require("./documentCategory"));
exports.DocumentCategory = documentCategory_1.default;
// Definiowanie relacji między modelami
document_1.default.belongsToMany(category_1.default, { through: documentCategory_1.default, foreignKey: 'documentId' });
category_1.default.belongsToMany(document_1.default, { through: documentCategory_1.default, foreignKey: 'categoryId' });
