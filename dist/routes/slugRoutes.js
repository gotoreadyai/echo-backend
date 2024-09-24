"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSlugRoutes = void 0;
const express_1 = require("express");
const slugController_1 = require("../controllers/slugController");
const verifyToken_1 = require("../middleware/verifyToken");
const ownership_1 = require("../middleware/ownership");
const createSlugRoutes = (model, modelName) => {
    const router = (0, express_1.Router)();
    router.get(`/${modelName}/slug/:slug`, (0, slugController_1.getOneBySlug)(model, modelName));
    router.put(`/${modelName}/slug/:slug`, verifyToken_1.verifyToken, (0, ownership_1.verifyOwnershipBySlug)(model, "slug"), (0, slugController_1.updateOneBySlug)(model, modelName));
    router.put(`/${modelName}/slug/:slug/content`, verifyToken_1.verifyToken, (0, ownership_1.verifyOwnershipBySlug)(model, "slug"), (0, slugController_1.updateContentBySlug)(model, modelName));
    return router;
};
exports.createSlugRoutes = createSlugRoutes;
exports.default = exports.createSlugRoutes;
