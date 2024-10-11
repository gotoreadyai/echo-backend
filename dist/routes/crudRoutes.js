"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const crudController = __importStar(require("../controllers/crudController"));
const pluralize_1 = __importDefault(require("pluralize"));
const verifyToken_1 = require("../middleware/verifyToken");
const ownership_1 = require("../middleware/ownership");
const createCrudRoutes = (model, modelName) => {
    const router = express_1.default.Router();
    const pluralizedName = (0, pluralize_1.default)(modelName);
    router.get(`/${pluralizedName}`, crudController.getAll(model, modelName));
    router.get(`/${modelName}/:id`, crudController.getOne(model, modelName));
    router.post(`/${modelName}`, verifyToken_1.verifyToken, crudController.createOne(model));
    router.put(`/${modelName}/:id`, verifyToken_1.verifyToken, (0, ownership_1.verifyOwnership)(model), crudController.updateOne(model, modelName));
    router.delete(`/${modelName}/:id`, verifyToken_1.verifyToken, (0, ownership_1.verifyOwnership)(model), crudController.deleteOne(model, modelName));
    return router;
};
exports.default = createCrudRoutes;
