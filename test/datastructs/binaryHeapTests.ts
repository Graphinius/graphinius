/// <reference path="../../typings/tsd.d.ts" />

import * as chai from 'chai';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';
import * as $CB from '../../src/utils/callbackUtils';
import * as $BH from '../../src/datastructs/binaryHeap';

var expect  = chai.expect,
    binHeap : $BH.BinaryHeap = null,
    Mode    = $BH.BinaryHeapMode;


describe('BINARY HEAP TESTS - ', () => {

  describe('Basic instantiation tests - ', () => {

    it('should correctly instantiate a bin heap', () => {
      binHeap = new $BH.BinaryHeap();
      expect(binHeap).not.to.be.null;
    });


    it('should correctly instantiate a bin heap with default _mode MIN', () => {
      binHeap = new $BH.BinaryHeap();
      expect(binHeap.getMode()).to.equal(Mode.MIN);
    });


    it('should correctly instantiate a bin heap with _mode set in constructor', () => {
      binHeap = new $BH.BinaryHeap(Mode.MAX);
      expect(binHeap.getMode()).to.equal(Mode.MAX);
    });


    it('should set a simple _eval function on its own', () => {
      binHeap = new $BH.BinaryHeap();
      expect(binHeap.getEvalKeyFun()).not.to.be.null;
      expect(typeof binHeap.getEvalKeyFun()).to.equal('function');
    });

  });


  /**
   * DEFAULT _eval function (just returns the numerical value of the object put in)
   */
  describe('Default input evaluation (priority extraction) tests - ', () => {

    beforeEach(() => {
      binHeap = new $BH.BinaryHeap();
    });


    it('should accept Integers as input and evaluate to that same Integer', () => {
      expect(binHeap.evalInputKey(55)).to.equal(55);
    });


    it('should accept negative Integers as input and evaluate to that same Integer', () => {
      expect(binHeap.evalInputKey(-55)).to.equal(-55);
    });


    it('should accept Floats as input and evaluate to their Integer value', () => {
      expect(binHeap.evalInputKey(55.55)).to.equal(55);
    });


    it('should accept negative Floats as input and evaluate to their Integer value', () => {
      expect(binHeap.evalInputKey(-55.55)).to.equal(-55);
    });


    it('should accept String encoded Integers as input and evaluate to their Integer value', () => {
      expect(binHeap.evalInputKey("55")).to.equal(55);
    });


    it('should accept String encoded negative Integers as input and evaluate to their Integer value', () => {
      expect(binHeap.evalInputKey("-55")).to.equal(-55);
    });


    it('should accept String encoded Floats as input and evaluate to their Integer value', () => {
      expect(binHeap.evalInputKey("55.55")).to.equal(55);
    });


    it('should accept String encoded negative Floats as input and evaluate to their Integer value', () => {
      expect(binHeap.evalInputKey("-55.55")).to.equal(-55);
    });


    it('should not accept booleans as input values (makes no sense...) ', () => {
      expect(binHeap.evalInputKey(true)).to.be.NaN;
      expect(binHeap.evalInputKey(false)).to.be.NaN;
    });


    it('should not accept strings that do not encode numbers', () => {
      expect(binHeap.evalInputKey("blahoo")).to.be.NaN;
    });


    it('should not accept arrays as input', () => {
      expect(binHeap.evalInputKey([1, 2, 3])).to.be.NaN;
    });


    it('should not accept objects as input', () => {
      expect(binHeap.evalInputKey({1: 1, 2: 2, 3: 3})).to.be.NaN;
    });


    it('should not accept functions as input', () => {
      expect(binHeap.evalInputKey(()=>{})).to.be.NaN;
    })

  });


  /**
   * CUSTOM _eval functions
   */
  describe('Should take a customized eval function, depending on our needs - ', () => {


    it('should take a custom eval function', () => {
      var evalFunc = (obj) => {
        return NaN;
      };
      binHeap = new $BH.BinaryHeap(Mode.MIN, evalFunc);

      expect(binHeap.evalInputKey(55)).to.be.NaN;
    });


    it('eval function that evaluates to the second element of an array...', () => {
      var evalFunc = (obj) => {
        if ( !Array.isArray((obj)) || obj.length < 2 ) {
          return NaN;
        }
        return parseInt(obj[1]);
      };
      binHeap = new $BH.BinaryHeap(Mode.MIN, evalFunc);

      expect(binHeap.evalInputKey(55)).to.be.NaN;
      expect(binHeap.evalInputKey("55")).to.be.NaN;
      expect(binHeap.evalInputKey([])).to.be.NaN;
      expect(binHeap.evalInputKey([1])).to.be.NaN;
      expect(binHeap.evalInputKey([1, 2])).to.equal(2);
    });

  });


  describe('Adding / removing elements tests - ', () => {

    it('should successfully add an element to the internal array');

    it('should successfully remove an element from the internal array');

  });


  describe('Ordering tests - MIN heap property - ', () => {



  });

});