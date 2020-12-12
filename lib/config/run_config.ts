const CMD_ENV_LOG = 'G_LOG';

const GENERIC_TYPES = {
  Node    : 'GENERIC',
  Edge    : 'GENERIC',
  Graph   : 'GENERIC'
};

const LOG_LEVELS = {
  debug: 'debug',
  production: 'production'
};

/**
 * Also checking if CMD line argument is given, which might not be the case
 * when running automated test cases.
 */
function runLevel() {
  let log_level = LOG_LEVELS.production;
  if ( typeof window === 'undefined' && typeof process !== 'undefined' && process.env && process.env[CMD_ENV_LOG]) {
    log_level = process.env[CMD_ENV_LOG]
  }
  return log_level;
}

export {
  LOG_LEVELS,
  GENERIC_TYPES,
  runLevel
};
