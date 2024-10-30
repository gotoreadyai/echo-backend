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
 * Zapisuje dane w formacie JSON do pliku na serwerze. Jeśli content jest przekazany, pobiera dane z pliku w katalogu seedSlug.
 * @param {string} directory - Ścieżka katalogu, w którym plik zostanie zapisany.
 * @param {string} name - Nazwa pliku (bez rozszerzenia).
 * @param {Object} data - Obiekt danych, które mają zostać zapisane w formacie JSON.
 * @param {string} [plugin] - Opcjonalna nazwa pluginu do pobrania contentu z pliku.
 * @param {boolean} [useContent] - Jeśli true, dane zostaną pobrane z pliku seedSlug/_init.json.
 * @returns {Promise<string>} - Obietnica zwracająca ścieżkę do utworzonego pliku.
 * @throws {Error} - Błąd, jeśli brakuje nazwy pliku, danych lub zapis się nie powiedzie.
 */
function saveJsonToFile(directory_1, name_1, data_1, plugin_1) {
    return __awaiter(this, arguments, void 0, function* (directory, name, data, plugin, useContent = false) {
        if (!name) {
            throw new Error("Brakuje nazwy pliku.");
        }
        let finalData = data;
        // Jeśli useContent jest true, pobierz dane z pliku _init.json
        if (useContent && plugin) {
            const contentPath = path_1.default.join("src", "plugins", plugin, "seedSlug", "_init.json");
            try {
                const content = yield promises_1.default.readFile(contentPath, "utf8");
                finalData = JSON.parse(content);
            }
            catch (error) {
                console.error(`Błąd podczas pobierania contentu z ${contentPath}:`, error);
                throw new Error("Nie udało się pobrać contentu z pliku.");
            }
        }
        // Zabezpieczenie nazwy pliku przed atakami path traversal
        const safeName = path_1.default.basename(name);
        // Ścieżka do zapisu pliku
        const filePath = path_1.default.join(directory, `${safeName}.json`);
        try {
            // Upewnij się, że katalog istnieje
            yield promises_1.default.mkdir(path_1.default.dirname(filePath), { recursive: true });
            // Zapisz dane do pliku w formacie JSON
            yield promises_1.default.writeFile(filePath, JSON.stringify(finalData, null, 2), "utf8");
            return filePath;
        }
        catch (error) {
            console.error("Błąd podczas zapisywania pliku:", error);
            throw new Error("Nie udało się zapisać pliku.");
        }
    });
}
