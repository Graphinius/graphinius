import {LOG_LEVELS, RUN_CONFIG} from '../config/run_config';

export interface LOG_CONFIG {
  log_level : string;
}

export enum LogColors {
  FgBlack   = 30,
  FgRed     = 31,
  FgGreen   = 32,
  FgYellow  = 33,
  FgBlue    = 34,
  FgMagenta = 35,
  FgCyan    = 36,
  FgWhite   = 37,

  BgBlack   = 40,
  BgRed     = 41,
  BgGreen   = 42,
  BgYellow  = 43,
  BgBlue    = 44,
  BgMagenta = 45,
  BgCyan    = 46,
  BgWhite   = 47
}

const DEFAULT_COLOR = 37; // white

class Logger {
  public config : LOG_CONFIG = null;
  
  constructor(config?) {
    this.config = config || RUN_CONFIG;
  }

  log(msg, color = DEFAULT_COLOR, bright = false) : boolean {
    if ( this.config.log_level === LOG_LEVELS.debug ) {
      console.log.call(console, this.colorize(color, msg, bright));
      return true;
    }
    return false;
  }
  
  error(err, color = DEFAULT_COLOR, bright = false) : boolean {
    if ( this.config.log_level === LOG_LEVELS.debug ) {
      console.error.call(console, this.colorize(color, err, bright));
      return true;
    }
    return false;
  }
  
  dir(obj, color = DEFAULT_COLOR, bright = false) : boolean {
    if ( this.config.log_level === LOG_LEVELS.debug ) {
      console.dir.call(console, this.colorize(color, obj, bright));
      return true;
    }
    return false;
  }
  
  info(msg, color = DEFAULT_COLOR, bright = false) : boolean {
    if ( this.config.log_level === LOG_LEVELS.debug ) {
        console.info.call(console, this.colorize(color, msg, bright));
      return true;
    }
    return false;
  }
  
  warn(msg, color = DEFAULT_COLOR, bright = false) : boolean {
    if ( this.config.log_level === LOG_LEVELS.debug ) {
        console.warn.call(console, this.colorize(color, msg, bright));
      return true;
    }
    return false;
  }

  write(msg, color = DEFAULT_COLOR, bright = false) : boolean {
    if ( this.config.log_level === LOG_LEVELS.debug ) {
      process.stdout.write.call(process.stdout, this.colorize(color, msg, bright));
      return true;
    }
    return false;
  }

  private colorize(color, output, bright) {
    let out_bright = bright ? '\x1b[1m' : null;
    return [out_bright, '\x1b[', color, 'm', output, '\x1b[0m'].join('');
  }

}

export { Logger };
