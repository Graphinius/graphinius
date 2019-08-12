"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CMD_ENV_LOG = 'G_LOG';
const GENERIC_TYPES = {
    Node: 'GENERIC',
    Edge: 'GENERIC',
    Graph: 'GENERIC'
};
exports.GENERIC_TYPES = GENERIC_TYPES;
const LOG_LEVELS = {
    debug: 'debug',
    production: 'production'
};
exports.LOG_LEVELS = LOG_LEVELS;
function runLevel() {
    let log_level = LOG_LEVELS.production;
    if (typeof window === 'undefined' && typeof process !== 'undefined' && process.env && process.env[CMD_ENV_LOG]) {
        log_level = process.env[CMD_ENV_LOG];
    }
    return log_level;
}
exports.runLevel = runLevel;
