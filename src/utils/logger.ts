/**
 * LOGGER UTILITY
 * 
 * @param context this pointer to the DFS or DFSVisit function
 */
let LOG_LEVELS = require('../../config/run_config.js').LOG_LEVELS;
let RUN_CONFIG = require('../../config/run_config.js').RUN_CONFIG;

export interface CONFIG {
  log_level : string;
}

class Logger {
  public config : CONFIG = null;
  
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