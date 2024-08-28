"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.File = exports.DocumentCategory = exports.Category = exports.Document = exports.User = exports.Workspace = void 0;
const workspace_1 = __importDefault(require("./workspace"));
exports.Workspace = workspace_1.default;
const user_1 = __importDefault(require("./user"));
exports.User = user_1.default;
const document_1 = __importDefault(require("./document"));
exports.Document = document_1.default;
const category_1 = __importDefault(require("./category"));
exports.Category = category_1.default;
const documentCategory_1 = __importDefault(require("./documentCategory"));
exports.DocumentCategory = documentCategory_1.default;
const file_1 = __importDefault(require("./file"));
exports.File = file_1.default;
