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
const booksModels_1 = require("./plugins/booksModels");
const filterByCategoryRoutes_1 = __importDefault(require("./plugins/filterByCategory/filterByCategoryRoutes"));
const app = (0, express_1.default)();
const cors = require("cors");
app.use(cors());
app.use(express_1.default.json());
app.use((0, crudRoutes_1.default)(models_1.Document, 'document'));
app.use((0, crudRoutes_1.default)(models_1.Category, 'category'));
app.use((0, crudRoutes_1.default)(booksModels_1.Language, 'language'));
app.use((0, crudRoutes_1.default)(booksModels_1.LessonObjective, 'lessonObjective'));
app.use((0, crudRoutes_1.default)(booksModels_1.BookTitle, 'bookTitle'));
app.use((0, crudRoutes_1.default)(booksModels_1.UnitTitle, 'unitTitle'));
app.use((0, crudRoutes_1.default)(booksModels_1.Subject, 'subject'));
app.use((0, crudRoutes_1.default)(booksModels_1.LessonStrategy, 'lessonStrategy'));
app.use(filterByCategoryRoutes_1.default);
app.use(errorHandler_1.errorHandler);
const PORT = process.env.PORT || 3000;
console.log(`-------------------------`);
db_1.default.sync({ force: true }).then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch(error => {
    console.error('Unable to connect to the database:', error);
});
