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
        this.config = config || run_config_1.RUN_CONFIG;
    }
    log(msg, color = DEFAULT_COLOR, bright = false) {
        if (this.config.log_level === run_config_1.LOG_LEVELS.debug) {
            console.log.call(console, this.colorize(color, msg, bright));
            return true;
        }
        return false;
    }
    error(err, color = DEFAULT_COLOR, bright = false) {
        if (this.config.log_level === run_config_1.LOG_LEVELS.debug) {
            console.error.call(console, this.colorize(color, err, bright));
            return true;
        }
        return false;
    }
    dir(obj, color = DEFAULT_COLOR, bright = false) {
        if (this.config.log_level === run_config_1.LOG_LEVELS.debug) {
            console.dir.call(console, this.colorize(color, obj, bright));
            return true;
        }
        return false;
    }
    info(msg, color = DEFAULT_COLOR, bright = false) {
        if (this.config.log_level === run_config_1.LOG_LEVELS.debug) {
            console.info.call(console, this.colorize(color, msg, bright));
            return true;
        }
        return false;
    }
    warn(msg, color = DEFAULT_COLOR, bright = false) {
        if (this.config.log_level === run_config_1.LOG_LEVELS.debug) {
            console.warn.call(console, this.colorize(color, msg, bright));
            return true;
        }
        return false;
    }
    write(msg, color = DEFAULT_COLOR, bright = false) {
        if (this.config.log_level === run_config_1.LOG_LEVELS.debug) {
            process.stdout.write.call(process.stdout, this.colorize(color, msg, bright));
            return true;
        }
        return false;
    }
    colorize(color, output, bright) {
        let out_bright = bright ? '\x1b[1m' : null;
        return [out_bright, '\x1b[', color, 'm', output, '\x1b[0m'].join('');
    }
}
exports.Logger = Logger;
