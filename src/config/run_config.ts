const LOG_LEVELS = {
  debug: "debug",
  production: "production"
};

const RUN_CONFIG = {
  log_level: process.env['G_LOG'] // LOG_LEVELS.debug
};

export {
  LOG_LEVELS,
  RUN_CONFIG
};