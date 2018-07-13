"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var run_config_1 = require("../config/run_config");
var DEFAULT_COLOR = 37; // white
var Logger = /** @class */ (function () {
    function Logger(config) {
        this.config = null;
        this.config = config || run_config_1.RUN_CONFIG;
    }
    Logger.prototype.log = function (msg, color) {
        if (color === void 0) { color = DEFAULT_COLOR; }
        if (this.config.log_level === run_config_1.LOG_LEVELS.debug) {
            console.log.call(console, this.colorize(color, msg));
            return true;
        }
        return false;
    };
    Logger.prototype.error = function (err, color) {
        if (color === void 0) { color = DEFAULT_COLOR; }
        if (this.config.log_level === run_config_1.LOG_LEVELS.debug) {
            console.error.call(console, this.colorize(color, err));
            return true;
        }
        return false;
    };
    Logger.prototype.dir = function (obj, color) {
        if (color === void 0) { color = DEFAULT_COLOR; }
        if (this.config.log_level === run_config_1.LOG_LEVELS.debug) {
            console.dir.call(console, this.colorize(color, obj));
            return true;
        }
        return false;
    };
    Logger.prototype.info = function (msg, color) {
        if (color === void 0) { color = DEFAULT_COLOR; }
        if (this.config.log_level === run_config_1.LOG_LEVELS.debug) {
            console.info.call(console, this.colorize(color, msg));
            return true;
        }
        return false;
    };
    Logger.prototype.warn = function (msg, color) {
        if (color === void 0) { color = DEFAULT_COLOR; }
        if (this.config.log_level === run_config_1.LOG_LEVELS.debug) {
            console.warn.call(console, this.colorize(color, msg));
            return true;
        }
        return false;
    };
    Logger.prototype.write = function (msg, color) {
        if (color === void 0) { color = DEFAULT_COLOR; }
        if (this.config.log_level === run_config_1.LOG_LEVELS.debug) {
            process.stdout.write.call(process.stdout, this.colorize(color, msg));
            return true;
        }
        return false;
    };
    Logger.prototype.colorize = function (color, output) {
        return ['\x1b[', color, 'm', output, '\x1b[0m'].join('');
    };
    return Logger;
}());
exports.Logger = Logger;
