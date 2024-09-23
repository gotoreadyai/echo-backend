"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.modelIncludes = void 0;
const workspace_1 = __importDefault(require("./models/workspace"));
exports.modelIncludes = {
    document: {
        include: [{ model: workspace_1.default, attributes: ["id", "slug"] }],
    },
};
