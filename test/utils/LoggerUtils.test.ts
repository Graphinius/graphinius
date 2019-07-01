import { LOG_LEVELS } from '../../src/config/run_config';

import { Logger, LOG_CONFIG } from '../../src/utils/Logger';
let logger : Logger = null;

let obj_to_log = {
  a: true,
  b: false,
  true: "false",
  arr: [1, 2, 3],
  hash: {"nest": "ed!", "is": true}
};


describe('Basic logger tests - ', () => {


  describe('debug config - ', () => {

    beforeAll(() => {
      const config : LOG_CONFIG = { log_level: LOG_LEVELS.debug };
      logger = new Logger(config);
    });

    afterAll(() => {
      logger = null;
    });
  
    test('Should successfully output a log message', () => {
      expect(logger.log("This is a default log message")).toBe(true);
    });
    
    test('Should successfully output an error message', () => {
      expect(logger.error("This is a default error message")).toBe(true);
    });
    
    test('Should successfully output an info message', () => {
      expect(logger.info("This is a default info message")).toBe(true);
    });
    
    test('Should successfully output a warning message', () => {
      expect(logger.warn("This is a default warning message")).toBe(true);
    });
    
    test('Should successfully output an object with nested properties', () => {
      expect(logger.dir(obj_to_log)).toBe(true);
    });

    test('Should successfully output a message via process.stdout', () => {
      expect(logger.write("This is a default stdout.write message")).toBe(true);
    });

  });


  /**
   * @todo adapt to new environment variable based logging!
   */
  describe('production config - ', () => {
    
    beforeAll(() => {
      const config : LOG_CONFIG = { log_level: LOG_LEVELS.production };
      logger = new Logger(config);
    });
    
    afterAll(() => {
      logger = null;
    });
    
    test('Should successfully output a log message', () => {
      expect(logger.log("This is a default log message")).toBe(false);
    });
    
    test('Should successfully output an error message', () => {
      expect(logger.error("This is a default error message")).toBe(false);
    });
    
    test('Should successfully output an info message', () => {
      expect(logger.info("This is a default info message")).toBe(false);
    });
    
    test('Should successfully output a warning message', () => {
      expect(logger.warn("This is a default warning message")).toBe(false);
    });
    
    test('Should successfully output an object with nested properties', () => {
      expect(logger.dir(obj_to_log)).toBe(false);
    });

    it('Should not output a message via process.stdout', () => {
      expect(logger.write(obj_to_log)).toBe(false);
    });

  });


  describe.skip('funny countdown function', () => {

    beforeAll(() => {
      const config : LOG_CONFIG = { log_level: LOG_LEVELS.debug };
      logger = new Logger(config);
    });
    
    afterAll(() => {
      logger = null;
    });


    it('should display the FINAL countdown...', () => {
      let countdown = 1e6;
      while ( countdown-- ) {
        logger.write(`It's the final countdown: ${countdown} \r`);
      }
    });

  });

});
