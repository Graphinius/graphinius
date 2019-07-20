const LOG_LEVELS = {
  debug: "debug",
  production: "production"
};

let log_level = process && process.env && process.env['G_LOG'] ? process.env['G_LOG'] : LOG_LEVELS.debug;

const RUN_CONFIG = {
  log_level
};

export {
  LOG_LEVELS,
  RUN_CONFIG
};

