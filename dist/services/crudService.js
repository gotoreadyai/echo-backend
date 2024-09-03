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
exports.remove = exports.updateBySlug = exports.update = exports.create = exports.findOneBySlug = exports.findOne = exports.findAllByForeignKey = exports.findAll = void 0;
const findAll = (model, options, page, pageSize) => __awaiter(void 0, void 0, void 0, function* () {
    const limit = pageSize || 10; // Domyślny rozmiar strony
    const offset = page ? (page - 1) * limit : 0;
    const findOptions = Object.assign(Object.assign({}, options), { limit,
        offset });
    const { rows, count } = yield model.findAndCountAll(findOptions);
    return {
        items: rows,
        totalItems: count,
        totalPages: Math.ceil(count / limit),
        currentPage: page || 1,
    };
});
exports.findAll = findAll;
const findAllByForeignKey = (model, foreignKey, foreignKeyValue, options, page, pageSize) => __awaiter(void 0, void 0, void 0, function* () {
    const limit = pageSize || 10; // Domyślny rozmiar strony
    const offset = page ? (page - 1) * limit : 0;
    const where = Object.assign({ [foreignKey]: foreignKeyValue }, ((options === null || options === void 0 ? void 0 : options.where) || {}));
    const findOptions = Object.assign(Object.assign({}, options), { where,
        limit,
        offset });
    const { rows, count } = yield model.findAndCountAll(findOptions);
    return {
        items: rows,
        totalItems: count,
        totalPages: Math.ceil(count / limit),
        currentPage: page || 1,
    };
});
exports.findAllByForeignKey = findAllByForeignKey;
const findOne = (model, id) => __awaiter(void 0, void 0, void 0, function* () {
    return (yield model.findByPk(id));
});
exports.findOne = findOne;
const findOneBySlug = (model, slug) => __awaiter(void 0, void 0, void 0, function* () {
    return (yield model.findOne({
        where: { slug },
    }));
});
exports.findOneBySlug = findOneBySlug;
const create = (model, data) => __awaiter(void 0, void 0, void 0, function* () {
    return (yield model.create(data));
});
exports.create = create;
const update = (model, id, data) => __awaiter(void 0, void 0, void 0, function* () {
    const options = {
        where: { id },
        returning: true,
    };
    const [affectedCount, affectedRows = null] = yield model.update(data, options);
    return [affectedCount, affectedRows];
});
exports.update = update;
const updateBySlug = (model, slug, data) => __awaiter(void 0, void 0, void 0, function* () {
    const options = {
        where: { slug },
        returning: true,
    };
    const [affectedCount, affectedRows = null] = yield model.update(data, options);
    return [affectedCount, affectedRows];
});
exports.updateBySlug = updateBySlug;
const remove = (model, id) => __awaiter(void 0, void 0, void 0, function* () {
    const options = {
        where: { id },
    };
    return yield model.destroy(options);
});
exports.remove = remove;
