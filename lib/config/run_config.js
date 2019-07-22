"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const LOG_LEVELS = {
    debug: 'debug',
    production: 'production'
};
exports.LOG_LEVELS = LOG_LEVELS;
let log_level = LOG_LEVELS.production;
if (typeof window === 'undefined' && typeof process !== 'undefined' && process.env) {
    log_level = process.env['G_LOG'];
}
const RUN_CONFIG = {
    log_level
};
exports.RUN_CONFIG = RUN_CONFIG;
