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
exports.updateContentBySlug = exports.updateOneBySlug = exports.getOneBySlug = void 0;
const slugService = __importStar(require("../services/slugService"));
const getOneBySlug = (model, modelName) => (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const item = yield slugService.findOneBySlug(model, req.params.slug);
        if (item) {
            res.json(item);
        }
        else {
            res.status(404).json({ error: `${modelName} not found` });
        }
    }
    catch (err) {
        next(err);
    }
});
exports.getOneBySlug = getOneBySlug;
const updateOneBySlug = (model, modelName) => (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const [updatedCount, updatedItems] = yield slugService.updateBySlug(model, req.params.slug, req.body);
        if (updatedCount > 0 && updatedItems) {
            res.json(updatedItems[0]);
        }
        else {
            res.status(404).json({ error: `${modelName} not found` });
        }
    }
    catch (err) {
        next(err);
    }
});
exports.updateOneBySlug = updateOneBySlug;
const updateContentBySlug = (model, modelName) => (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { key, value } = req.body;
        if (!key || value === undefined) {
            return res.status(404).json({ error: `Key and value are required` });
        }
        const item = yield model.findOne({
            where: { slug: req.params.slug },
        });
        if (!item) {
            console.log(`${modelName} not found`);
            return res.status(404).json(`${modelName} not found`);
        }
        // Zaktualizuj tylko wybrany klucz w obiekcie content
        const updatedContent = Object.assign(Object.assign({}, item.content), { [key]: value });
        item.content = updatedContent;
        yield item.save();
        res.json({ [modelName]: item });
    }
    catch (err) {
        next(err);
    }
});
exports.updateContentBySlug = updateContentBySlug;
