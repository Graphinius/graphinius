import {LOG_LEVELS, RUN_CONFIG} from '../config/run_config';

export interface LOG_CONFIG {
  log_level : string;
}

class Logger {
  public config : LOG_CONFIG = null;
  
  constructor(config?) {
    this.config = config || RUN_CONFIG;
  }

  log(msg) : boolean {
    if ( this.config.log_level === LOG_LEVELS.debug ) {
      console.log.apply(console, Array.prototype.slice.call(arguments));
      return true;
    }
    return false;
  }
  
  error(err) : boolean {
    if ( this.config.log_level === LOG_LEVELS.debug ) {
      console.error.apply(console, Array.prototype.slice.call(arguments));
      return true;
    }
    return false;
  }
  
  dir(obj) : boolean {
    if ( this.config.log_level === LOG_LEVELS.debug ) {
      console.dir.apply(console, Array.prototype.slice.call(arguments));
      return true;
    }
    return false;
  }
  
  info(msg) : boolean {
    if ( this.config.log_level === LOG_LEVELS.debug ) {
        console.info.apply(console, Array.prototype.slice.call(arguments));
      return true;
    }
    return false;
  }
  
  warn(msg) : boolean {
    if ( this.config.log_level === LOG_LEVELS.debug ) {
        console.warn.apply(console, Array.prototype.slice.call(arguments));
      return true;
    }
    return false;
  }
}

export { Logger };