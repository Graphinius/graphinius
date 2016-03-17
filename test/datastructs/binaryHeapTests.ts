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


    it('should correctly initialize the heap to size ZERO', () => {
      binHeap = new $BH.BinaryHeap();
      expect(binHeap.size()).to.equal(0);
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
      expect(binHeap.getEvalPriorityFun()).to.be.an.instanceOf(Function);
    });
    
    
    it('should correctly set a default evalObjID function just returning an object', () => {
      binHeap = new $BH.BinaryHeap();
      expect(binHeap.getEvalObjIDFun()).to.be.an.instanceOf(Function);
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
      expect(binHeap.evalInputPriority(55)).to.equal(55);
    });


    it('should accept negative Integers as input and evaluate to that same Integer', () => {
      expect(binHeap.evalInputPriority(-55)).to.equal(-55);
    });


    it('should accept Floats as input and evaluate to their Integer value', () => {
      expect(binHeap.evalInputPriority(55.55)).to.equal(55);
    });


    it('should accept negative Floats as input and evaluate to their Integer value', () => {
      expect(binHeap.evalInputPriority(-55.55)).to.equal(-55);
    });


    it('should accept String encoded Integers as input and evaluate to their Integer value', () => {
      expect(binHeap.evalInputPriority("55")).to.equal(55);
    });


    it('should accept String encoded negative Integers as input and evaluate to their Integer value', () => {
      expect(binHeap.evalInputPriority("-55")).to.equal(-55);
    });


    it('should accept String encoded Floats as input and evaluate to their Integer value', () => {
      expect(binHeap.evalInputPriority("55.55")).to.equal(55);
    });


    it('should accept String encoded negative Floats as input and evaluate to their Integer value', () => {
      expect(binHeap.evalInputPriority("-55.55")).to.equal(-55);
    });


    it('should not accept booleans as input values (makes no sense...) ', () => {
      expect(binHeap.evalInputPriority(true)).to.be.NaN;
      expect(binHeap.evalInputPriority(false)).to.be.NaN;
    });


    it('should not accept strings that do not encode numbers', () => {
      expect(binHeap.evalInputPriority("blahoo")).to.be.NaN;
    });


    it('should not accept arrays as input', () => {
      expect(binHeap.evalInputPriority([1, 2, 3])).to.be.NaN;
    });


    it('should not accept objects as input', () => {
      expect(binHeap.evalInputPriority({1: 1, 2: 2, 3: 3})).to.be.NaN;
    });


    it('should not accept functions as input', () => {
      expect(binHeap.evalInputPriority(()=>{})).to.be.NaN;
    });

  });


  /**
   * Object ID function tests
   */
  describe('Object ID function tests - ', () => {

    beforeEach(() => {
      binHeap = new $BH.BinaryHeap();
    });


    it('The default evalObjID function should just return the input obj', () => {
      expect(binHeap.evalInputObjID("bla")).to.equal("bla");
      expect(binHeap.evalInputObjID(55)).to.equal(55);
      expect(binHeap.evalInputObjID(true)).to.equal(true);
      expect(binHeap.evalInputObjID([1,2,3,4])).to.deep.equal([1,2,3,4]);
      expect(binHeap.evalInputObjID({a: 'bla', b: 'hoo'})).to.deep.equal({a: 'bla', b: 'hoo'});
    });


    it('should take a custom evalObjID function', () => {
      var evalObjIDFunc = (obj) => {
        return obj._id;
      };
      binHeap = new $BH.BinaryHeap(Mode.MIN, undefined, evalObjIDFunc);

      expect(binHeap.evalInputObjID("blahoo")).to.be.undefined;
      expect(binHeap.evalInputObjID({_id: 'bla', _name: 'hoo'})).to.equal('bla');
    });


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

      expect(binHeap.evalInputPriority(55)).to.be.NaN;
    });


    it('eval function that evaluates to the second element of an array...', () => {
      var evalFunc = (obj) => {
        if ( !Array.isArray((obj)) || obj.length < 2 ) {
          return NaN;
        }
        return parseInt(obj[1]);
      };
      binHeap = new $BH.BinaryHeap(Mode.MIN, evalFunc);

      expect(binHeap.evalInputPriority(55)).to.be.NaN;
      expect(binHeap.evalInputPriority("55")).to.be.NaN;
      expect(binHeap.evalInputPriority([])).to.be.NaN;
      expect(binHeap.evalInputPriority([1])).to.be.NaN;
      expect(binHeap.evalInputPriority([1, 2])).to.equal(2);
    });
  });


  describe('Adding / removing elements and peek tests - ', () => {

    beforeEach(() => {
      binHeap = new $BH.BinaryHeap();
    });


    it('should refuse to add an element whose priority evaluates to NaN', () => {
      expect(binHeap.insert.bind(binHeap, "blahoo")).to.throw("Cannot insert object without numeric priority.");
    });


    it('should add a valid element to the internal array', () => {
      var old_size = binHeap.size();
      binHeap.insert(1);
      expect(binHeap.size()).to.equal(old_size + 1);
    });


    it('should throw an error when trying to remove an invalid object', () => {
      expect(binHeap.remove.bind(binHeap, undefined)).to.throw('Object invalid.');
    });


    it('should return undefined when retrieving a non-existing, valid object', () => {
      expect(binHeap.remove(55)).to.be.undefined;
    });


    it('should remove an existing element from the internal array', () => {
      binHeap.insert(55);
      expect(binHeap.remove(55)).to.equal(55);
    });


    it('valid object removal, this time with custom objID and evalPriority functions', () => {
      var evalObjID = (obj) => {
        return obj.__blahoo._id;
      };
      var evalObjPriority = (obj) => {
        return obj.__priority;
      };
      binHeap = new $BH.BinaryHeap(undefined, evalObjPriority, evalObjID);
      var obj = {
        __blahoo: {
          _id: 'yihaa'
        },
        __priority: 55
      };
      var old_size = binHeap.size();
      binHeap.insert(obj);
      expect(binHeap.size()).to.equal(old_size + 1);
      expect(binHeap.remove(obj)).to.equal(obj);
      expect(binHeap.size()).to.equal(old_size);
    });


    it('should give undefined if we peek into an empty heap', () => {
      expect(binHeap.peek()).to.be.undefined;
    });


    it('should give us the correct object if we peek into a heap', () => {
      var evalObjID = (obj) => {
        return obj._id;
      };
      var evalObjPriority = (obj) => {
        return obj._priority;
      };
      binHeap = new $BH.BinaryHeap(undefined, evalObjPriority, evalObjID);
      binHeap.insert({_id: 'bla', _priority: 55});
      expect(binHeap.peek()).to.deep.equal({_id: 'bla', _priority: 55});
    });

  });


  describe('Ordering tests on single elements - ', () => {
    
    // it('should trickle down a smaller element in a MIN HEAP', () => {
    //   binHeap = new $BH.BinaryHeap();
    //   binHeap.insert(5);
    //   binHeap.insert(15);
    //   binHeap.insert(155);
    //   binHeap.insert(55);
    //   expect(binHeap.peek()).to.equal(5);
    // });
    //
    //
    // it('should trickle down a larger element in a MAX HEAP', () => {
    //   binHeap = new $BH.BinaryHeap(Mode.MAX);
    //   binHeap.insert(115);
    //   binHeap.insert(55);
    //   binHeap.insert(75);
    //   binHeap.insert(5);
    //
    //   console.dir(binHeap);
    //   expect(binHeap.peek()).to.equal(115);
    // });
    //
    //
    // it('should trickle up correctly upon removing an object, MIN HEAP', () => {
    //   binHeap = new $BH.BinaryHeap();
    //   binHeap.insert(5);
    //   binHeap.insert(1);
    //   binHeap.insert(16);
    //   binHeap.insert(7);
    //   binHeap.insert(8);
    //
    //   console.dir(binHeap);
    //   expect(binHeap.getMin()).to.equal(1);
    //   expect(binHeap.peek()).to.equal(5);
    // });
    //
    //
    // it('should trickle up correctly upon removing an object, MAX HEAP', () => {
    //   binHeap = new $BH.BinaryHeap(Mode.MAX);
    //   binHeap.insert(5);
    //   binHeap.insert(1);
    //   binHeap.insert(16);
    //   binHeap.insert(7);
    //   binHeap.insert(8);
    //
    //   console.dir(binHeap);
    //
    //   expect(binHeap.remove(16)).to.equal(16);
    //
    //   console.dir(binHeap);
    //   expect(binHeap.peek()).to.equal(8);
    // });


    // it('tests MIN heap on a slightly larger example', () => {
    //   binHeap = new $BH.BinaryHeap();
    //   for ( var i = 0; i < 500; i++ ) {
    //     binHeap.insert((Math.random()*100000 - 50000)|0);
    //   }
    //   // console.dir(binHeap);
    //   var priority = Number.NEGATIVE_INFINITY;
    //   for ( var i = 0; i < 500; i++ ) {
    //     binHeap.insert((Math.random()*100000 - 50000)|0);
    //   }
    // });

  });

});