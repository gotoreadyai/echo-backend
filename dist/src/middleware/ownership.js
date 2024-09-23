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
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyOwnershipBySlug = exports.verifyOwnership = void 0;
const verifyOwnership = (model) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const resourceId = req.params.id;
        const userId = req.user.id;
        const userRole = req.user.role;
        try {
            const resource = yield model.findByPk(resourceId);
            if (!resource) {
                return res.status(404).json({ error: `${model.name} not found` });
            }
            if (userRole === 'admin') {
                return next();
            }
            const ownerId = resource.ownerId;
            if (ownerId !== userId) {
                return res.status(403).json({ error: `You are not the owner of this ${model.name.toLowerCase()}` });
            }
            next();
        }
        catch (error) {
            return res.status(500).json({ error: 'Internal server error' });
        }
    });
};
exports.verifyOwnership = verifyOwnership;
const verifyOwnershipBySlug = (model, slugField) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const slug = req.params.slug;
        const userId = req.user.id;
        const userRole = req.user.role;
        try {
            // Define the where condition using the proper typing
            const whereCondition = {
                [slugField]: slug,
            };
            // Find the resource by slug
            const resource = yield model.findOne({ where: whereCondition });
            if (!resource) {
                return res.status(404).json({ error: `${model.name} not found` });
            }
            // Admin users have access to all resources
            if (userRole === 'admin') {
                return next();
            }
            // Check if the current user is the owner of the resource
            const ownerId = resource.ownerId;
            if (ownerId !== userId) {
                return res.status(403).json({ error: `You are not the owner of this ${model.name.toLowerCase()}` });
            }
            next();
        }
        catch (error) {
            return res.status(500).json({ error: 'Internal server error' });
        }
    });
};
exports.verifyOwnershipBySlug = verifyOwnershipBySlug;
