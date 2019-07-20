"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const LOG_LEVELS = {
    debug: "debug",
    production: "production"
};
exports.LOG_LEVELS = LOG_LEVELS;
let log_level = process && process.env && process.env['G_LOG'] ? process.env['G_LOG'] : LOG_LEVELS.debug;
const RUN_CONFIG = {
    log_level
};
exports.RUN_CONFIG = RUN_CONFIG;
