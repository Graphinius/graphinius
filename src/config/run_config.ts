const LOG_LEVELS = {
  debug: 'debug',
  production: 'production'
};

let log_level = LOG_LEVELS.production;
if ( typeof window === 'undefined' && typeof process !== 'undefined' && process.env) {
  log_level = process.env['G_LOG']
}

const RUN_CONFIG = {
  log_level
};

export {
  LOG_LEVELS,
  RUN_CONFIG
};

