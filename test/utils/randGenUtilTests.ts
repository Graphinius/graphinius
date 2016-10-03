/// <reference path="../../typings/tsd.d.ts" />

import * as chai from 'chai';
import { Logger } from '../../src/utils/logger';
import * as randgen from '../../src/utils/randGenUtils';

var logger = new Logger({log_level: "PRODUCTION"}); // {log_level: "PRODUCTION"}
var expect = chai.expect;

logger.log(randgen);
for (var i = 0; i < 50; i++){
  logger.log(randgen.rnorm(0, 5));
}

describe('Random Number Generator Utils Tests - ', () => {
  
  it.skip('Should successfully output a log message', () => {
    expect(logger.log("This is a default log message")).to.be.true;
  });
  
});