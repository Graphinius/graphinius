"use strict";
var LOG_LEVELS = require('../../config/run_config.js').LOG_LEVELS;
var RUN_CONFIG = require('../../config/run_config.js').RUN_CONFIG;
var Logger = (function () {
    function Logger(config) {
        this.config = null;
        this.config = config || RUN_CONFIG;
    }
    Logger.prototype.log = function (msg) {
        if (this.config.log_level === LOG_LEVELS.debug) {
            console.log.apply(console, Array.prototype.slice.call(arguments));
            return true;
        }
        return false;
    };
    Logger.prototype.error = function (err) {
        if (this.config.log_level === LOG_LEVELS.debug) {
            console.error.apply(console, Array.prototype.slice.call(arguments));
            return true;
        }
        return false;
    };
    Logger.prototype.dir = function (obj) {
        if (this.config.log_level === LOG_LEVELS.debug) {
            console.dir.apply(console, Array.prototype.slice.call(arguments));
            return true;
        }
        return false;
    };
    Logger.prototype.info = function (msg) {
        if (this.config.log_level === LOG_LEVELS.debug) {
            console.info.apply(console, Array.prototype.slice.call(arguments));
            return true;
        }
        return false;
    };
    Logger.prototype.warn = function (msg) {
        if (this.config.log_level === LOG_LEVELS.debug) {
            console.warn.apply(console, Array.prototype.slice.call(arguments));
            return true;
        }
        return false;
    };
    return Logger;
}());
exports.Logger = Logger;
