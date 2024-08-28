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
exports.verifyOwnership = void 0;
const document_1 = __importDefault(require("../models/document"));
const verifyOwnership = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const documentId = req.params.id;
    // Rzutujemy `req` na `RequestWithUser` aby użyć `user`
    const userId = req.user.id;
    const userRole = req.user.role;
    try {
        const document = yield document_1.default.findByPk(documentId);
        if (!document) {
            return res.status(404).json({ error: 'Document not found' });
        }
        // Jeśli użytkownik jest administratorem, pozwalamy mu na edycję/usunięcie
        if (userRole === 'admin') {
            return next();
        }
        // Jeśli użytkownik nie jest właścicielem dokumentu, odrzucamy żądanie
        if (document.ownerId !== userId) {
            return res.status(403).json({ error: 'You are not the owner of this document' });
        }
        next();
    }
    catch (error) {
        return res.status(500).json({ error: 'Internal server error' });
    }
});
exports.verifyOwnership = verifyOwnership;
