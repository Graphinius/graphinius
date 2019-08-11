import {LOG_LEVELS, RUN_CONFIG} from '../config/run_config';

export interface LOG_CONFIG {
	log_level: string;
}

export enum LogColors {
	FgBlack = 30,
	FgRed = 31,
	FgGreen = 32,
	FgYellow = 33,
	FgBlue = 34,
	FgMagenta = 35,
	FgCyan = 36,
	FgWhite = 37,

	BgBlack = 40,
	BgRed = 41,
	BgGreen = 42,
	BgYellow = 43,
	BgBlue = 44,
	BgMagenta = 45,
	BgCyan = 46,
	BgWhite = 47
}

const DEFAULT_COLOR = 37; // white

class Logger {
	public config: LOG_CONFIG = null;

	constructor(config?) {
		this.config = config || {
			log_level: RUN_CONFIG.log_level
		};
	}

	log(msg, color?, bright = false): boolean {
		if (this.config.log_level === LOG_LEVELS.debug) {
			if ( color ) {
				console.log.call(console, Logger.colorize(DEFAULT_COLOR, msg, bright));
			}
			else {
				console.log.call(console, msg);
			}
			return true;
		}
		return false;
	}

	error(err, color?, bright = false): boolean {
		if (this.config.log_level === LOG_LEVELS.debug) {
			if ( color ) {
				console.error.call(console, Logger.colorize(color, err, bright));
			}
			else {
				console.error.call(console, err);
			}
			return true;
		}
		return false;
	}

	dir(obj, color?, bright = false): boolean {
		if (this.config.log_level === LOG_LEVELS.debug) {
			if ( color ) {
				console.dir.call(console, Logger.colorize(DEFAULT_COLOR, obj, bright));
			}
			else {
				console.dir.call(console, obj);
			}
			return true;
		}
		return false;
	}

	info(msg, color?, bright = false): boolean {
		if (this.config.log_level === LOG_LEVELS.debug) {
			if ( color ) {
				console.info.call(console, Logger.colorize(DEFAULT_COLOR, msg, bright));
			}
			else {
				console.info.call(console, msg);
			}
			return true;
		}
		return false;
	}

	warn(msg, color?, bright = false): boolean {
		if (this.config.log_level === LOG_LEVELS.debug) {
			if ( color ) {
				console.warn.call(console, Logger.colorize(DEFAULT_COLOR, msg, bright));
			}
			else {
				console.warn.call(console, msg);
			}
			return true;
		}
		return false;
	}

	write(msg, color?, bright = false): boolean {
		if (this.config.log_level === LOG_LEVELS.debug) {
			if ( color ) {
				process.stdout.write.call(process.stdout, Logger.colorize(DEFAULT_COLOR, msg, bright));
			}
			else {
				process.stdout.write.call(process.stdout, msg);
			}
			return true;
		}
		return false;
	}

  /**
   * @todo this one prevents objects from being output in detail ([object Object])
   * @param color
   * @param output
   * @param bright
   */
	static colorize(color, output, bright) {
		let out_bright = bright ? '\x1b[1m' : null;
		return [out_bright, '\x1b[', color, 'm', output, '\x1b[0m'].join('');
	}

}

export {Logger};
