"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const errorHandler = (err, _req, res, _next) => {
    console.error(err.stack);
    if (err.message) {
        res.status(500).json({ error: err.message });
    }
    res.status(500).json({ error: "Something went wrong! - check server logs" });
};
exports.errorHandler = errorHandler;
