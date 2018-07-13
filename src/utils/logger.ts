import {LOG_LEVELS, RUN_CONFIG} from '../config/run_config';

export interface LOG_CONFIG {
  log_level : string;
}

const DEFAULT_COLOR = 37; // white

class Logger {
  public config : LOG_CONFIG = null;
  
  constructor(config?) {
    this.config = config || RUN_CONFIG;
  }

  log(msg, color = DEFAULT_COLOR) : boolean {
    if ( this.config.log_level === LOG_LEVELS.debug ) {
      console.log.call(console, this.colorize(color, msg));
      return true;
    }
    return false;
  }
  
  error(err, color = DEFAULT_COLOR) : boolean {
    if ( this.config.log_level === LOG_LEVELS.debug ) {
      console.error.call(console, this.colorize(color, err));
      return true;
    }
    return false;
  }
  
  dir(obj, color = DEFAULT_COLOR) : boolean {
    if ( this.config.log_level === LOG_LEVELS.debug ) {
      console.dir.call(console, this.colorize(color, obj));
      return true;
    }
    return false;
  }
  
  info(msg, color = DEFAULT_COLOR) : boolean {
    if ( this.config.log_level === LOG_LEVELS.debug ) {
        console.info.call(console, this.colorize(color, msg));
      return true;
    }
    return false;
  }
  
  warn(msg, color = DEFAULT_COLOR) : boolean {
    if ( this.config.log_level === LOG_LEVELS.debug ) {
        console.warn.call(console, this.colorize(color, msg));
      return true;
    }
    return false;
  }

  write(msg, color = DEFAULT_COLOR) : boolean {
    if ( this.config.log_level === LOG_LEVELS.debug ) {
      process.stdout.write.call(process.stdout, this.colorize(color, msg));
      return true;
    }
    return false;
  }

  private colorize(color, output) {
    return ['\x1b[', color, 'm', output, '\x1b[0m'].join('');
  }

}

export { Logger };
