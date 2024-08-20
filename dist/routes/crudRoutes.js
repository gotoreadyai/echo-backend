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
/**
 * createCrudRoutes is a function that creates a router for CRUD operations
 * on a given model. It takes in a model and a model name as parameters and
 * returns a router.
 *
 * @param model - a Sequelize model
 * @param modelName - a string representing the name of the model
 * @return a router object for CRUD operations on the model
 */
const createCrudRoutes = (model, modelName) => {
    const router = express_1.default.Router();
    const pluralizedName = (0, pluralize_1.default)(modelName);
    console.log(`-------------------------`);
    console.log(`GET:/${pluralizedName}`);
    console.log(`GET:/${modelName}/:id`);
    console.log(`POST:/${modelName}`);
    console.log(`PUT:/${modelName}/:id`);
    console.log(`DELETE:/${modelName}/:id`);
    router.get(`/${pluralizedName}`, crudController.getAll(model, modelName));
    router.get(`/${modelName}/:id`, crudController.getOne(model, modelName));
    router.post(`/${modelName}`, crudController.createOne(model, modelName));
    router.put(`/${modelName}/:id`, crudController.updateOne(model, modelName));
    router.delete(`/${modelName}/:id`, crudController.deleteOne(model, modelName));
    return router;
};
exports.default = createCrudRoutes;
