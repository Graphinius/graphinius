/// <reference path="../../typings/tsd.d.ts" />

/**
 * TODO switching to production should not raise errors... !!!
 */

import * as chai from 'chai';
import { Logger } from '../../src/utils/logger';

var expect = chai.expect;
var logger : Logger = null;
var obj_to_log = {
  a: true,
  b: false,
  true: "false",
  arr: [1, 2, 3],
  hash: {"nest": "ed!", "is": true}
};


describe('Basic logger tests - (standard) DEBUG config - ', () => {
  
  before(() => {
    logger = new Logger();
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


describe('basic logger tests - production config ', () => {
  
  before(() => {
    var config = {
      log_level: "PRODUCTION"
    };
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
