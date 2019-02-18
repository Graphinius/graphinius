import * as chai from 'chai';
import { LOG_LEVELS } from '../../src/config/run_config';
import { Logger, LOG_CONFIG } from '../../src/utils/logger';

var expect = chai.expect;
var logger : Logger = null;
var obj_to_log = {
  a: true,
  b: false,
  true: "false",
  arr: [1, 2, 3],
  hash: {"nest": "ed!", "is": true}
};


describe('Basic logger tests - (standard) DEBUG config - output expected - ', () => {

  describe('Basic logger function tests - ', () => {

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

  });


  /**
   * @todo adapt to new environment variable based logging!
   */
  describe('basic logger tests - production config - NO output expected - ', () => {
    
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

  });

});
