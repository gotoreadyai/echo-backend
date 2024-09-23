"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_1 = __importDefault(require("./db"));
const errorHandler_1 = require("./middleware/errorHandler");
/* #PLUGINS IMPORTS */
const Routes_1 = __importDefault(require("./plugins/publisherCore/Routes"));
const Routes_2 = __importDefault(require("./plugins/JWTauth/Routes"));
const Routes_3 = __importDefault(require("./plugins/contentUpdateBySlug/Routes"));
/* !#PLUGINS IMPORTS */
const app = (0, express_1.default)();
const cors = require("cors");
app.use(cors());
app.use(express_1.default.json());
// app.use(createCrudRoutes(Category, "category"));
// app.use(createCrudRoutes(File, "file"));
/* #PLUGINS REGISTER */
app.use(Routes_1.default);
// app.use(filterByCategoryRoutes);
// app.use(schoolBooksCascade);
app.use(Routes_2.default);
// app.use(openAICall);
app.use(Routes_3.default);
/* !PLUGINS REGISTER */
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
