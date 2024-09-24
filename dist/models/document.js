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
exports.include = void 0;
const sequelize_1 = require("sequelize");
const db_1 = __importDefault(require("../db"));
const workspace_1 = __importDefault(require("./workspace"));
const user_1 = __importDefault(require("./user"));
const slugGenerator_1 = require("../utils/slugGenerator");
class Document extends sequelize_1.Model {
}
Document.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
    },
    title: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    slug: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    content: {
        type: sequelize_1.DataTypes.JSONB,
        defaultValue: {},
        allowNull: false,
    },
    workspaceId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
        references: {
            model: "Workspaces",
            key: "id",
        },
        onDelete: "CASCADE",
    },
    ownerId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
    },
}, {
    sequelize: db_1.default,
    modelName: "Document",
    hooks: {
        beforeCreate: (document) => __awaiter(void 0, void 0, void 0, function* () {
            document.slug = yield (0, slugGenerator_1.generateUniqueSlug)(Document, document.title, document.id);
        }),
    },
});
// Relacja z modelem User
Document.belongsTo(user_1.default, { foreignKey: "ownerId", as: "owner" });
// Poprawione relacje
Document.belongsTo(workspace_1.default, { foreignKey: "workspaceId" });
workspace_1.default.hasMany(Document, { foreignKey: "workspaceId" });
exports.default = Document;
exports.include = {
    model: workspace_1.default,
};
