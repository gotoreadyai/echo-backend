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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteOne = exports.updateOne = exports.createOne = exports.getOne = exports.getAllByForeignKey = exports.getAll = void 0;
const crudService = __importStar(require("../services/crudService"));
const pluralize_1 = __importDefault(require("pluralize"));
const getAll = (model, modelName) => (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const pluralizedName = (0, pluralize_1.default)(modelName);
        const items = yield crudService.findAll(model);
        res.json({ [`${pluralizedName}`]: items });
    }
    catch (err) {
        next(err);
    }
});
exports.getAll = getAll;
const getAllByForeignKey = (model, modelName, foreignKey) => (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const foreignKeyValue = req.params.id;
        const pluralizedName = (0, pluralize_1.default)(modelName);
        const items = yield crudService.findAllByForeignKey(model, foreignKey, foreignKeyValue);
        res.json({ [`${pluralizedName}`]: items });
    }
    catch (err) {
        next(err);
    }
});
exports.getAllByForeignKey = getAllByForeignKey;
const getOne = (model, modelName) => (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const item = yield crudService.findOne(model, req.params.id);
        if (item) {
            res.json({ [modelName]: item });
        }
        else {
            res.status(404).send(`${modelName} not found`);
        }
    }
    catch (err) {
        next(err);
    }
});
exports.getOne = getOne;
const createOne = (model, modelName) => (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userReq = req;
        const newItem = yield model.create(Object.assign(Object.assign({}, req.body), { ownerId: userReq.user.id }));
        res.status(201).json(newItem);
    }
    catch (error) {
        res.status(500).json({ error: `Failed to create ${modelName}` });
    }
});
exports.createOne = createOne;
const updateOne = (model, modelName) => (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const [updatedCount, updatedItems] = yield crudService.update(model, req.params.id, req.body);
        if (updatedCount > 0 && updatedItems) {
            res.json({ [modelName]: updatedItems[0] });
        }
        else {
            res.status(404).send(`${modelName} not found`);
        }
    }
    catch (err) {
        next(err);
    }
});
exports.updateOne = updateOne;
const deleteOne = (model, modelName) => (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("delete", model, req.params.id);
    try {
        const deletedCount = yield crudService.remove(model, req.params.id);
        if (deletedCount > 0) {
            res.status(200).json({ [modelName]: req.params.id });
        }
        else {
            res.status(404).send(`${modelName} not found`);
        }
    }
    catch (err) {
        next(err);
    }
});
exports.deleteOne = deleteOne;
