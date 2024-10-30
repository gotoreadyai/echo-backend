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
exports.saveContent = void 0;
const seedService_1 = require("../services/seedService");
const path_1 = __importDefault(require("path"));
/**
 * Middleware do zapisu treści (Content) z uzupełnieniem na podstawie modelu slug.
 * @param {ModelStatic<Model>} slugModel - Model Sequelize używany do pobierania danych dla sluga.
 * @returns Middleware funkcja Express
 */
const saveContent = (slugModel) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { plugin, name } = req.body;
            // Ścieżka do pliku _init.json na podstawie plugin i slug
            const contentFilePath = path_1.default.join("src", "plugins", plugin, "seedSlug", "_init.json");
            try {
                // Pobierz dane z modelu slug i uzupełnij zawartość JSON
                const slugData = yield slugModel.findAll({});
                if (!slugData.length) {
                    return res
                        .status(404)
                        .json({
                        error: `No slug data found for the plugin: ${plugin}. Please ensure the plugin and slug are correct.`
                    });
                }
                const updatedContent = slugData.map((item) => ({
                    model: name,
                    data: Object.assign({}, item.dataValues),
                }));
                // Zapisz zaktualizowane dane do pliku
                const filePath = yield (0, seedService_1.saveJsonToFile)(`./incommingSeeds/${plugin}`, `_init.json.${name}`, updatedContent);
                return res
                    .status(200)
                    .json({
                    message: `Content for ${name} successfully retrieved and saved in ${filePath}`
                });
            }
            catch (error) {
                console.error(`Error retrieving content from ${contentFilePath}:`, error);
                return res
                    .status(500)
                    .json({
                    error: `Error retrieving content from the specified file at: ${contentFilePath}. Please check the file path and try again.`
                });
            }
        }
        catch (error) {
            next(error); // Przekazanie błędu do middleware błędów
        }
    });
};
exports.saveContent = saveContent;
