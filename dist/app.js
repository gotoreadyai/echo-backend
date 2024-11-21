"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_1 = __importDefault(require("./db"));
const crudRoutes_1 = __importDefault(require("./routes/crudRoutes"));
const slugRoutes_1 = __importDefault(require("./routes/slugRoutes"));
const models_1 = require("./models");
const errorHandler_1 = require("./middleware/errorHandler");
const listRotues_1 = require("./utils/listRotues");
const seedFileController_1 = require("./controllers/seedFileController");
/* #PLUGINS IMPORTS */
const Routes_1 = __importDefault(require("./plugins/_JWTauth/Routes"));
const Routes_2 = __importDefault(require("./plugins/_GoogleAuth/Routes"));
const Routes_3 = __importDefault(require("./plugins/openAI/Routes"));
const Routes_4 = __importDefault(require("./plugins/schoolDaze/Routes"));
/* !#PLUGINS IMPORTS */
const app = (0, express_1.default)();
const cors = require("cors");
app.use(cors());
app.use(express_1.default.json());
app.use((0, crudRoutes_1.default)(models_1.Workspace, "workspace"));
app.use((0, crudRoutes_1.default)(models_1.Document, "document"));
app.use((0, crudRoutes_1.default)(models_1.User, "user"));
app.use((0, crudRoutes_1.default)(models_1.CallingFunction, "callingFunction"));
app.use((0, crudRoutes_1.default)(models_1.Permission, "permission"));
app.use((0, slugRoutes_1.default)(models_1.Workspace, "workspace"));
app.use((0, slugRoutes_1.default)(models_1.Document, "document"));
/* create content as a seed file inside plugin*/
app.post("/seed", seedFileController_1.saveFiles);
/* #PLUGINS */
app.use(Routes_1.default);
app.use(Routes_2.default);
app.use(Routes_3.default);
app.use(Routes_4.default);
/* !#PLUGINS */
(0, listRotues_1.listRoutes)(app);
// Tutaj dodajesz "catch-all" dla nieistniejących tras
app.use((req, res, next) => {
    const error = new Error(`Cannot ${req.method} ${req.originalUrl}`);
    // Przypisujemy status jako właściwość obiektu
    error.status = 404;
    next(error);
});
app.use(errorHandler_1.errorHandler);
const PORT = process.env.PORT || 3000;
db_1.default
    .sync()
    .then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
})
    .catch((error) => {
    console.error("Unable to connect to the database:", error);
});
