"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const run_config_1 = require("../config/run_config");
class Logger {
    constructor(config) {
        this.config = null;
        this.config = config || run_config_1.RUN_CONFIG;
    }
    log(msg) {
        if (this.config.log_level === run_config_1.LOG_LEVELS.debug) {
            console.log.apply(console, Array.prototype.slice.call(arguments));
            return true;
        }
        return false;
    }
    error(err) {
        if (this.config.log_level === run_config_1.LOG_LEVELS.debug) {
            console.error.apply(console, Array.prototype.slice.call(arguments));
            return true;
        }
        return false;
    }
    dir(obj) {
        if (this.config.log_level === run_config_1.LOG_LEVELS.debug) {
            console.dir.apply(console, Array.prototype.slice.call(arguments));
            return true;
        }
        return false;
    }
    info(msg) {
        if (this.config.log_level === run_config_1.LOG_LEVELS.debug) {
            console.info.apply(console, Array.prototype.slice.call(arguments));
            return true;
        }
        return false;
    }
    warn(msg) {
        if (this.config.log_level === run_config_1.LOG_LEVELS.debug) {
            console.warn.apply(console, Array.prototype.slice.call(arguments));
            return true;
        }
        return false;
    }
}
exports.Logger = Logger;
