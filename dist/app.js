"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_1 = __importDefault(require("./db"));
const crudRoutes_1 = __importDefault(require("./routes/crudRoutes"));
const models_1 = require("./models");
const errorHandler_1 = require("./middleware/errorHandler");
const Routes_1 = __importDefault(require("./plugins/filterByCategory/Routes"));
const Routes_2 = __importDefault(require("./plugins/schoolBooksCascade/Routes"));
const Routes_3 = __importDefault(require("./plugins/JWTauth/Routes"));
const Routes_4 = __importDefault(require("./plugins/openAI/Routes"));
const Routes_5 = __importDefault(require("./plugins/contentUpdateBySlug/Routes"));
const app = (0, express_1.default)();
const cors = require("cors");
app.use(cors());
app.use(express_1.default.json());
app.use((0, crudRoutes_1.default)(models_1.Workspace, "workspace", undefined, undefined, true));
app.use((0, crudRoutes_1.default)(models_1.Document, "document", "workspaceId", "workspace", true));
app.use((0, crudRoutes_1.default)(models_1.Category, "category"));
app.use((0, crudRoutes_1.default)(models_1.User, "user"));
app.use((0, crudRoutes_1.default)(models_1.File, "file"));
app.use(Routes_1.default);
app.use(Routes_2.default);
app.use(Routes_3.default);
app.use(Routes_4.default);
// app.use("/api", contentUpdateBySlug);
app.use(Routes_5.default);
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
