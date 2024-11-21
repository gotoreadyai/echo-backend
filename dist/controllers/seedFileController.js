"use strict";
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
exports.saveFiles = void 0;
const seedService_1 = require("../services/seedService");
const document_1 = __importDefault(require("./../models/document"));
/**
 * Middleware do zapisu dokumentów do plików.
 * @param {Request} req - Obiekt żądania Express.
 * @param {Response} res - Obiekt odpowiedzi Express.
 * @param {NextFunction} next - Funkcja do przekazania sterowania do następnego middleware.
 * @returns {Promise<void>} - Zwraca obietnicę zakończenia operacji.
 */
const saveFiles = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { plugin } = req.body;
        const documents = yield document_1.default.findAll({
            where: { plugin: plugin },
        });
        if (!documents.length) {
            return res.status(404).json({
                error: `No documents found for the provided plugin: ${plugin}. Please ensure the plugin name is correct.`,
            });
        }
        for (const document of documents) {
            const fileName = `${document.slug}`;
            yield (0, seedService_1.saveJsonToFile)(`./incommingSeeds/${plugin}`, fileName, document.content);
        }
        return res.status(200).json({
            message: `Successfully retrieved and saved ${documents.length} documents for the plugin: ${plugin}.`,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.saveFiles = saveFiles;
