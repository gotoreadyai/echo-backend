"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.include = void 0;
const sequelize_1 = require("sequelize");
const db_1 = __importDefault(require("../db"));
const workspace_1 = __importDefault(require("./workspace"));
const user_1 = __importDefault(require("./user"));
class Permission extends sequelize_1.Model {
}
Permission.include = {
    model: workspace_1.default,
    attributes: ["id", "title", "slug"],
};
Permission.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
    },
    onlyYours: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
    },
    canCreate: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
    },
    canUpdate: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
    },
    canDelete: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
    },
    canRead: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
    },
    role: {
        type: sequelize_1.DataTypes.ENUM("admin", "user", "teacher", "student"),
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
    modelName: "Permission",
});
// Relacja z modelem User
Permission.belongsTo(user_1.default, { foreignKey: "ownerId", as: "owner" });
// Poprawione relacje
Permission.belongsTo(workspace_1.default, { foreignKey: "workspaceId" });
workspace_1.default.hasMany(Permission, { foreignKey: "workspaceId" });
exports.default = Permission;
exports.include = {
    model: workspace_1.default,
};
