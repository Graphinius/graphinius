"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const run_config_1 = require("../config/run_config");
var LogColors;
(function (LogColors) {
    LogColors[LogColors["FgBlack"] = 30] = "FgBlack";
    LogColors[LogColors["FgRed"] = 31] = "FgRed";
    LogColors[LogColors["FgGreen"] = 32] = "FgGreen";
    LogColors[LogColors["FgYellow"] = 33] = "FgYellow";
    LogColors[LogColors["FgBlue"] = 34] = "FgBlue";
    LogColors[LogColors["FgMagenta"] = 35] = "FgMagenta";
    LogColors[LogColors["FgCyan"] = 36] = "FgCyan";
    LogColors[LogColors["FgWhite"] = 37] = "FgWhite";
    LogColors[LogColors["BgBlack"] = 40] = "BgBlack";
    LogColors[LogColors["BgRed"] = 41] = "BgRed";
    LogColors[LogColors["BgGreen"] = 42] = "BgGreen";
    LogColors[LogColors["BgYellow"] = 43] = "BgYellow";
    LogColors[LogColors["BgBlue"] = 44] = "BgBlue";
    LogColors[LogColors["BgMagenta"] = 45] = "BgMagenta";
    LogColors[LogColors["BgCyan"] = 46] = "BgCyan";
    LogColors[LogColors["BgWhite"] = 47] = "BgWhite";
})(LogColors = exports.LogColors || (exports.LogColors = {}));
const DEFAULT_COLOR = 37;
class Logger {
    constructor(config) {
        this.config = null;
        this.config = config || {
            log_level: run_config_1.RUN_CONFIG.log_level
        };
    }
    log(msg, color, bright = false) {
        if (this.config.log_level === run_config_1.LOG_LEVELS.debug) {
            if (color) {
                console.log.call(console, Logger.colorize(DEFAULT_COLOR, msg, bright));
            }
            else {
                console.log.call(console, msg);
            }
            return true;
        }
        return false;
    }
    error(err, color, bright = false) {
        if (this.config.log_level === run_config_1.LOG_LEVELS.debug) {
            if (color) {
                console.error.call(console, Logger.colorize(color, err, bright));
            }
            else {
                console.error.call(console, err);
            }
            return true;
        }
        return false;
    }
    dir(obj, color, bright = false) {
        if (this.config.log_level === run_config_1.LOG_LEVELS.debug) {
            if (color) {
                console.dir.call(console, Logger.colorize(DEFAULT_COLOR, obj, bright));
            }
            else {
                console.dir.call(console, obj);
            }
            return true;
        }
        return false;
    }
    info(msg, color, bright = false) {
        if (this.config.log_level === run_config_1.LOG_LEVELS.debug) {
            if (color) {
                console.info.call(console, Logger.colorize(DEFAULT_COLOR, msg, bright));
            }
            else {
                console.info.call(console, msg);
            }
            return true;
        }
        return false;
    }
    warn(msg, color, bright = false) {
        if (this.config.log_level === run_config_1.LOG_LEVELS.debug) {
            if (color) {
                console.warn.call(console, Logger.colorize(DEFAULT_COLOR, msg, bright));
            }
            else {
                console.warn.call(console, msg);
            }
            return true;
        }
        return false;
    }
    write(msg, color, bright = false) {
        if (this.config.log_level === run_config_1.LOG_LEVELS.debug) {
            if (color) {
                process.stdout.write.call(process.stdout, Logger.colorize(DEFAULT_COLOR, msg, bright));
            }
            else {
                process.stdout.write.call(process.stdout, msg);
            }
            return true;
        }
        return false;
    }
    static colorize(color, output, bright) {
        let out_bright = bright ? '\x1b[1m' : null;
        return [out_bright, '\x1b[', color, 'm', output, '\x1b[0m'].join('');
    }
}
exports.Logger = Logger;
