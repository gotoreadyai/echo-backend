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
exports.saveJsonToFile = saveJsonToFile;
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
/**
 * Zapisuje dane JSON do pliku na serwerze.
 * @param {string} directory - Katalog, w którym ma zostać zapisany plik.
 * @param {string} name - Nazwa pliku bez rozszerzenia.
 * @param {Object} data - Dane do zapisania w formacie JSON.
 * @returns {Promise<string>} Ścieżka do utworzonego pliku.
 */
function saveJsonToFile(directory, name, data) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!name || !data) {
            throw new Error("Brakuje nazwy pliku lub danych.");
        }
        // Zabezpieczenie nazwy pliku przed atakami path traversal
        const safeName = path_1.default.basename(name);
        // Ścieżka do zapisu pliku
        const filePath = path_1.default.join(directory, `${safeName}.json`);
        try {
            // Upewnij się, że katalog istnieje
            yield promises_1.default.mkdir(path_1.default.dirname(filePath), { recursive: true });
            // Zapisz dane do pliku w formacie JSON
            yield promises_1.default.writeFile(filePath, JSON.stringify(data, null, 2), "utf8");
            return filePath;
        }
        catch (error) {
            console.error("Błąd podczas zapisywania pliku:", error);
            throw new Error("Nie udało się zapisać pliku.");
        }
    });
}
