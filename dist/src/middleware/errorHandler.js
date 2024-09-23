"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const errorHandler = (error, _req, res, _next) => {
    if (error.message) {
        res.status(500).json({
            error: error.message,
            details: error instanceof Error ? error.message : "Unknown error",
            fullError: error,
        });
    }
    else {
        res
            .status(500)
            .json({ error: "Something went wrong! - check server logs" });
    }
};
exports.errorHandler = errorHandler;
