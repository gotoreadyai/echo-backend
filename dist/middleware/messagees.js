"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.log = void 0;
const log = (message, color) => {
    color === 'red' && console.log('\x1b[31m%s\x1b[0m', message);
    color === 'blue' && console.log('\x1b[34m%s\x1b[0m', message);
    color === 'green' && console.log('\x1b[32m%s\x1b[0m', message);
    color === 'yellow' && console.log('\x1b[33m%s\x1b[0m', message);
    color === 'cyan' && console.log('\x1b[36m%s\x1b[0m', message);
    color === 'gray-bg' && console.log(`\x1b[48;5;237m\x1b[38;5;250m${message}                     \x1b[0m`);
};
exports.log = log;
