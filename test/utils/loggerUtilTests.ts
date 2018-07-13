/// <reference path="../../typings/tsd.d.ts" />

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

    before(() => {
      const config : LOG_CONFIG = { log_level: LOG_LEVELS.debug };
      logger = new Logger(config);
    });

    after(() => {
      logger = null;
    });
  
    it('Should successfully output a log message', () => {
      expect(logger.log("This is a default log message")).to.be.true;
    });
    
    it('Should successfully output an error message', () => {
      expect(logger.error("This is a default error message")).to.be.true;
    });
    
    it('Should successfully output an info message', () => {
      expect(logger.info("This is a default info message")).to.be.true;
    });
    
    it('Should successfully output a warning message', () => {
      expect(logger.warn("This is a default warning message")).to.be.true;
    });
    
    it('Should successfully output an object with nested properties', () => {
      expect(logger.dir(obj_to_log)).to.be.true;
    });

  });


  /**
   * @todo adapt to new environment variable based logging!
   */
  describe('basic logger tests - production config - NO output expected - ', () => {
    
    before(() => {
      const config : LOG_CONFIG = { log_level: LOG_LEVELS.production };
      logger = new Logger(config);
    });
    
    after(() => {
      logger = null;
    });
    
    it('Should successfully output a log message', () => {
      expect(logger.log("This is a default log message")).to.be.false;
    });
    
    it('Should successfully output an error message', () => {
      expect(logger.error("This is a default error message")).to.be.false;
    });
    
    it('Should successfully output an info message', () => {
      expect(logger.info("This is a default info message")).to.be.false;
    });
    
    it('Should successfully output a warning message', () => {
      expect(logger.warn("This is a default warning message")).to.be.false;
    });
    
    it('Should successfully output an object with nested properties', () => {
      expect(logger.dir(obj_to_log)).to.be.false;
    });

  });

});
