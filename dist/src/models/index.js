"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = exports.Workspace = exports.Document = void 0;
const user_1 = __importDefault(require("./user"));
exports.User = user_1.default;
const document_1 = __importDefault(require("./document"));
exports.Document = document_1.default;
const workspace_1 = __importDefault(require("./workspace"));
exports.Workspace = workspace_1.default;
