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
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteOne = exports.updateOne = exports.createOne = exports.getOne = exports.getAll = void 0;
const crudService = __importStar(require("../services/crudService"));
const MODEL_INCLUDES_1 = require("../MODEL_INCLUDES"); // Import mapy include
const getAll = (model, modelName) => (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { page, pageSize, where } = req.query;
        const parsedPage = page ? parseInt(page, 10) : undefined;
        const parsedPageSize = pageSize
            ? parseInt(pageSize, 10)
            : undefined;
        // Pobierz odpowiedni include z pliku na podstawie modelName
        const modelInclude = ((_a = MODEL_INCLUDES_1.modelIncludes[modelName]) === null || _a === void 0 ? void 0 : _a.include) || [];
        const options = {
            where: where,
            include: modelInclude, // Dynamicznie załaduj include dla modelu
            limit: parsedPageSize,
            offset: parsedPage && parsedPageSize
                ? (parsedPage - 1) * parsedPageSize
                : undefined,
        };
        const items = yield crudService.findAll(model, options, parsedPage, parsedPageSize);
        res.json(items);
    }
    catch (err) {
        next(err);
    }
});
exports.getAll = getAll;
const getOne = (model, modelName) => (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const item = yield crudService.findOne(model, req.params.id);
        if (item) {
            res.json(item);
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
const createOne = (model) => (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userReq = req;
        const newItem = yield model.create(Object.assign(Object.assign({}, req.body), { ownerId: userReq.user.id }));
        res.status(201).json(newItem);
    }
    catch (err) {
        next(err);
    }
});
exports.createOne = createOne;
const updateOne = (model, modelName) => (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const [updatedCount, updatedItems] = yield crudService.update(model, req.params.id, req.body);
        if (updatedCount > 0 && updatedItems) {
            res.json(updatedItems[0]);
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
    try {
        const deletedCount = yield crudService.remove(model, req.params.id);
        if (deletedCount > 0) {
            res.status(200).json(req.params.id);
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
