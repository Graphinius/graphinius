/// <reference path="../../typings/tsd.d.ts" />

import * as chai from 'chai';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';
import * as $CB from '../../src/utils/callbackUtils';

var expect = chai.expect;

describe('general callback util tests - ', () => {

  it('should execute an array of callback functions', () => {
    var scope = {
      msg_a: "",
      msg_b: ""
    };
    var funcArray = [];
    funcArray.push( function( context ) {
      context["msg_a"] = "Hello from func A.";
    });
    funcArray.push( function( context ) {
      context["msg_b"] = "Hello from func B.";
    });
    $CB.execCallbacks(funcArray, scope);
    expect(scope.msg_a).to.equal("Hello from func A.");
    expect(scope.msg_b).to.equal("Hello from func B.");
  });

});