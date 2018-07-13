/// <reference path="../../typings/tsd.d.ts" />

import * as chai from 'chai';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';
import * as $CB from '../../src/utils/callbackUtils';
import * as $BH from '../../src/datastructs/binaryHeap';
import { Logger } from '../../src/utils/logger';
const logger = new Logger();

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
      expect(binHeap.evalInputScore(55)).to.equal(55);
    });


    it('should accept negative Integers as input and evaluate to that same Integer', () => {
      expect(binHeap.evalInputScore(-55)).to.equal(-55);
    });


    it('should accept Floats as input and evaluate to their Integer value', () => {
      expect(binHeap.evalInputScore(55.55)).to.equal(55);
    });


    it('should accept negative Floats as input and evaluate to their Integer value', () => {
      expect(binHeap.evalInputScore(-55.55)).to.equal(-55);
    });


    it('should accept String encoded Integers as input and evaluate to their Integer value', () => {
      expect(binHeap.evalInputScore("55.55")).to.equal(55);
    });


    it('should accept String encoded negative Integers as input and evaluate to their Integer value', () => {
      expect(binHeap.evalInputScore("-55.55")).to.equal(-55);
    });


    it('should accept String encoded Floats as input and evaluate to their Integer value', () => {
      expect(binHeap.evalInputScore("55.55")).to.equal(55);
    });


    it('should accept String encoded negative Floats as input and evaluate to their Integer value', () => {
      expect(binHeap.evalInputScore("-55.55")).to.equal(-55);
    });


    it('should not accept booleans as input values (makes no sense...) ', () => {
      expect(binHeap.evalInputScore(true)).to.be.NaN;
      expect(binHeap.evalInputScore(false)).to.be.NaN;
    });


    it('should not accept strings that do not encode numbers', () => {
      expect(binHeap.evalInputScore("blahoo")).to.be.NaN;
    });


    it('should not accept arrays as input', () => {
      expect(binHeap.evalInputScore([1, 2, 3])).to.be.NaN;
    });


    it('should not accept objects as input', () => {
      expect(binHeap.evalInputScore({1: 1, 2: 2, 3: 3})).to.be.NaN;
    });


    it('should not accept functions as input', () => {
      expect(binHeap.evalInputScore(()=>{})).to.be.NaN;
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

      expect(binHeap.evalInputScore(55)).to.be.NaN;
    });


    it('eval function that evaluates to the second element of an array...', () => {
      var evalFunc = (obj) => {
        if ( !Array.isArray((obj)) || obj.length < 2 ) {
          return NaN;
        }
        return parseInt(obj[1]);
      };
      binHeap = new $BH.BinaryHeap(Mode.MIN, evalFunc);

      expect(binHeap.evalInputScore(55)).to.be.NaN;
      expect(binHeap.evalInputScore("55")).to.be.NaN;
      expect(binHeap.evalInputScore([])).to.be.NaN;
      expect(binHeap.evalInputScore([1])).to.be.NaN;
      expect(binHeap.evalInputScore([1, 2])).to.equal(2);
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


  describe('_position map tests - ', () => {

    it('should produce correct _position maps for a small positive integer sequence', () => {
      binHeap = new $BH.BinaryHeap();
      let controlMap = {};
      expect( binHeap.getPositions() ).to.deep.equal({});
      
      binHeap.insert(155);
      controlMap =  { '155': { score: 155, position: 0 } };
      expect( binHeap.getPositions() ).to.deep.equal(controlMap);      

      binHeap.insert(0);
      controlMap =  { '0': { score: 0, position: 0 },
                      '155': { score: 155, position: 1 } };
      expect( binHeap.getPositions() ).to.deep.equal(controlMap); 

      binHeap.insert(15);
      controlMap =  { '0': { score: 0, position: 0 },
                      '15': { score: 15, position: 2 },
                      '155': { score: 155, position: 1 } };
      expect( binHeap.getPositions() ).to.deep.equal(controlMap); 

      binHeap.insert(5);
      controlMap =  { '0': { score: 0, position: 0 },
                      '5': { score: 5, position: 1 },
                      '15': { score: 15, position: 2 },
                      '155': { score: 155, position: 3 } };    
      expect( binHeap.getPositions() ).to.deep.equal(controlMap);

      binHeap.insert(1);
      controlMap =  { '0': { score: 0, position: 0 },
                      '1': { score: 1, position: 1 },
                      '5': { score: 5, position: 4 },
                      '15': { score: 15, position: 2 },
                      '155': { score: 155, position: 3 } };    
      expect( binHeap.getPositions() ).to.deep.equal(controlMap);

      expect(binHeap.pop()).to.equal(0);
      controlMap =  { '1': { score: 1, position: 0 },
                      '5': { score: 5, position: 1 },
                      '15': { score: 15, position: 2 },
                      '155': { score: 155, position: 3 } };
      expect( binHeap.getPositions() ).to.deep.equal(controlMap);
    

      expect(binHeap.pop()).to.equal(1);
      controlMap =  { '5': { score: 5, position: 0 },
                      '15': { score: 15, position: 2 },
                      '155': { score: 155, position: 1 } };    
      expect( binHeap.getPositions() ).to.deep.equal(controlMap);

      expect(binHeap.pop()).to.equal(5);
      controlMap =  { '15': { score: 15, position: 0 },
                      '155': { score: 155, position: 1 } };
      expect( binHeap.getPositions() ).to.deep.equal(controlMap);

      expect(binHeap.pop()).to.equal(15);
      controlMap =  { '155': { score: 155, position: 0 } };    
      expect( binHeap.getPositions() ).to.deep.equal(controlMap);

      expect(binHeap.pop()).to.equal(155);
      controlMap = {};    
      expect( binHeap.getPositions() ).to.deep.equal(controlMap);
    });

    /**
     * @TODO Do the same for negative integers, zeros, and mixed ints and zeros...
     */

  });


  describe('Ordering tests on single elements - ', () => {
    
    it('should trickle up a smaller element in a MIN HEAP', () => {
      binHeap = new $BH.BinaryHeap();
      binHeap.insert(155);
      binHeap.insert(55);
      binHeap.insert(15);
      binHeap.insert(5);
      binHeap.insert(1);
      expect(binHeap.peek()).to.equal(1);
    });
    
    
    it('should trickle up a smaller element in a MIN HEAP, with ZERO', () => {
      binHeap = new $BH.BinaryHeap();

      binHeap.insert(155);
      binHeap.insert(0);
      binHeap.insert(15);
      binHeap.insert(5);
      binHeap.insert(1);
      
      logger.log("\n ##### POPPING ##### \n")
      expect(binHeap.pop()).to.equal(0);
      expect(binHeap.pop()).to.equal(1);
      expect(binHeap.pop()).to.equal(5);
      expect(binHeap.pop()).to.equal(15);
      expect(binHeap.pop()).to.equal(155);
    });


    it('should trickle up a larger element in a MAX HEAP', () => {
      binHeap = new $BH.BinaryHeap(Mode.MAX);
      binHeap.insert(1);
      binHeap.insert(5);
      binHeap.insert(55);
      binHeap.insert(75);
      binHeap.insert(115);
      
      expect(binHeap.peek()).to.equal(115);
    });


    it('should trickle correctly upon removing an object, MIN HEAP', () => {
      binHeap = new $BH.BinaryHeap();
      binHeap.insert(5);
      binHeap.insert(9);
      binHeap.insert(11);
      binHeap.insert(14);
      binHeap.insert(18);
      binHeap.insert(19);
      binHeap.insert(21);
      binHeap.insert(33);
      binHeap.insert(17);
      binHeap.insert(27);
      expect(binHeap.getArray()).to.deep.equal([5, 9, 11, 14, 18, 19, 21, 33, 17, 27]);
      
      binHeap.insert(7);
      expect(binHeap.getArray()).to.deep.equal([5, 7, 11, 14, 9, 19, 21, 33, 17, 27, 18]);
      
      expect(binHeap.pop()).to.equal(5);
      expect(binHeap.getArray()).to.deep.equal([7, 9, 11, 14, 18, 19, 21, 33, 17, 27]);
      
      expect(binHeap.pop()).to.equal(7);
      expect(binHeap.getArray()).to.deep.equal([9, 14, 11, 17, 18, 19, 21, 33, 27]);
      
      expect(binHeap.pop()).to.equal(9);
      expect(binHeap.getArray()).to.deep.equal([11, 14, 19, 17, 18, 27, 21, 33]);
      
      expect(binHeap.pop()).to.equal(11);
      expect(binHeap.getArray()).to.deep.equal([14, 17, 19, 33, 18, 27, 21]);
      
      expect(binHeap.pop()).to.equal(14);
      expect(binHeap.getArray()).to.deep.equal([17, 18, 19, 33, 21, 27]);
      
      expect(binHeap.pop()).to.equal(17);
      expect(binHeap.getArray()).to.deep.equal([18, 21, 19, 33, 27]);
      
      expect(binHeap.pop()).to.equal(18);
      expect(binHeap.getArray()).to.deep.equal([19, 21, 27, 33]);
      
      expect(binHeap.pop()).to.equal(19);
      expect(binHeap.getArray()).to.deep.equal([21, 33, 27]);
      
      expect(binHeap.pop()).to.equal(21);
      expect(binHeap.getArray()).to.deep.equal([27, 33]);
      
      expect(binHeap.pop()).to.equal(27);
      expect(binHeap.getArray()).to.deep.equal([33]);
      
      expect(binHeap.pop()).to.equal(33);
      expect(binHeap.getArray()).to.deep.equal([]);
    });
    
    
    it('should trickle up correctly upon removing an object, MAX HEAP', () => {
      binHeap = new $BH.BinaryHeap(Mode.MAX);
      binHeap.insert(5);
      binHeap.insert(1);
      binHeap.insert(16);
      binHeap.insert(7);
      binHeap.insert(8);
    
      expect(binHeap.remove(16)).to.equal(16);
      expect(binHeap.pop()).to.equal(8);
      expect(binHeap.pop()).to.equal(7);
      expect(binHeap.pop()).to.equal(5);
      expect(binHeap.pop()).to.equal(1);
    });
    
    
    it('MIN heap should work with negative integers', () => {
      binHeap = new $BH.BinaryHeap(Mode.MIN);
      binHeap.insert(-5);
      binHeap.insert(-1);
      binHeap.insert(-16);
      binHeap.insert(-7);
      binHeap.insert(-8);
    
      expect(binHeap.remove(16)).to.be.undefined;
      
      expect(binHeap.pop()).to.equal(-16);
      expect(binHeap.pop()).to.equal(-8);
      expect(binHeap.pop()).to.equal(-7);
      expect(binHeap.pop()).to.equal(-5);
      expect(binHeap.pop()).to.equal(-1);
    });
    
    
    it('MAX heap should work with negative integers', () => {
      binHeap = new $BH.BinaryHeap(Mode.MAX);
      binHeap.insert(-5);
      binHeap.insert(-1);
      binHeap.insert(-16);
      binHeap.insert(-7);
      binHeap.insert(-8);
    
      expect(binHeap.remove(16)).to.be.undefined;
      
      expect(binHeap.pop()).to.equal(-1);
      expect(binHeap.pop()).to.equal(-5);
      expect(binHeap.pop()).to.equal(-7);
      expect(binHeap.pop()).to.equal(-8);
      expect(binHeap.pop()).to.equal(-16);
    });
    
    
    it('MIN heap should work with mixed integers plus zero', () => {
      binHeap = new $BH.BinaryHeap(Mode.MIN);
      binHeap.insert(0);
      binHeap.insert(-5);
      binHeap.insert(1);
      binHeap.insert(-16);
      binHeap.insert(7);
      binHeap.insert(-8);
      
      expect(binHeap.pop()).to.equal(-16);
      expect(binHeap.pop()).to.equal(-8);
      expect(binHeap.pop()).to.equal(-5);
      expect(binHeap.pop()).to.equal(0);
      expect(binHeap.pop()).to.equal(1);
      expect(binHeap.pop()).to.equal(7);
    });
    
    
    it('should find a given element in the binary Heap', () => {
      binHeap = new $BH.BinaryHeap(Mode.MIN);
      binHeap.insert(0);
      binHeap.insert(-5);
      binHeap.insert(1);
      binHeap.insert(-16);
      binHeap.insert(0);
      binHeap.insert(7);
      binHeap.insert(-8);
      binHeap.insert(0);
      
      expect(binHeap.find(-16)).to.equal(-16);
      expect(binHeap.find(-8)).to.equal(-8);
      expect(binHeap.find(-5)).to.equal(-5);
      expect(binHeap.find(0)).to.equal(0);
      expect(binHeap.find(0)).to.equal(0);
      expect(binHeap.find(0)).to.equal(0);
      expect(binHeap.find(1)).to.equal(1);
      expect(binHeap.find(7)).to.equal(7);
    });
    

    it('tests MIN heap on a slightly larger example and floats', () => {      
      var evalPriority = (obj:any) => {
        if ( typeof obj !== 'number' && typeof obj !== 'string') {
          return NaN;
        }
        return typeof obj === 'number' ? obj : parseFloat(obj);
      };
      binHeap = new $BH.BinaryHeap(Mode.MIN, evalPriority);
      
      for ( var i = 0; i < 5000; i++ ) {
        binHeap.insert((Math.random()*1000 - 500));
      }
      
      var binArray = binHeap.getArray(),
          ith = 0,
          left_child_idx = 0,
          right_child_idx = 0;
      for ( var i = 0; i < binArray.length; i++ ) {
        ith = binArray[i],
        left_child_idx = (i+1)*2-1,
        right_child_idx = (i+1)*2;
        if ( left_child_idx < binArray.length ) {
          expect(ith).to.be.at.most(binArray[left_child_idx]);
        }
        if ( right_child_idx < binArray.length ) {
          expect(ith).to.be.at.most(binArray[right_child_idx]);
        }
      }
       
      var last = Number.NEGATIVE_INFINITY,
          current,
          heap_size = binHeap.size();
      for ( var i = 0; i < 5000; i++ ) {
        current = binHeap.pop();
        if ( typeof current !== 'undefined') {
          expect(current).to.be.at.least(last);
          expect(binHeap.size()).to.equal(heap_size - 1);
          last = current;
          --heap_size;
        }
      }
      
    });


    it('tests MAX heap on a slightly larger example', () => {
      binHeap = new $BH.BinaryHeap(Mode.MAX);
      for ( var i = 0; i < 5000; i++ ) {
        binHeap.insert((Math.random()*1000 - 500)|0);
      }
      
      var binArray = binHeap.getArray(),
          ith = 0,
          left_child_idx = 0,
          right_child_idx = 0;
      for ( var i = 0; i < binArray.length; i++ ) {
        ith = binArray[i],
        left_child_idx = (i+1)*2-1,
        right_child_idx = (i+1)*2;
        if ( left_child_idx < binArray.length ) {
          expect(ith).to.be.at.least(binArray[left_child_idx]);
        }
        if ( right_child_idx < binArray.length ) {
          expect(ith).to.be.at.least(binArray[right_child_idx]);
        }
      }
      
      var last = Number.POSITIVE_INFINITY,
          current,
          heap_size = binHeap.size();
      for ( var i = 0; i < 5000; i++ ) {
        if ( typeof current !== 'undefined') {
          current = binHeap.pop();
          expect(current).to.be.at.most(last);
          last = current;
          --heap_size;
        }
      }
    });
    
    
    /**
     * TODO Outsource to performance testing...
     */
    it('should run 30000 finds in just a few milliseconds', () => {
      binHeap = new $BH.BinaryHeap(Mode.MIN);
      var i = 0;
      while ( i < 30000 ) {
        binHeap.insert( i++ );
      }      
      while ( i ) {
        expect(binHeap.find(--i)).to.equal(i);
      }      
    });
    
    
    it('should run 30000 removes in just a few milliseconds (if the O(1) algorithm works...)', () => {
      binHeap = new $BH.BinaryHeap(Mode.MIN);
      var i = 0;
      while ( i < 30000 ) {
        binHeap.insert( i++ );
      }
      while ( i ) {
        expect(binHeap.remove(--i)).to.equal(i);
      }      
    });

  });

});


describe('BINARY HEAP PRIVATE METHOD TESTS', () => {
  
  it('Should correclty set some simple node positions', () => {
    binHeap = new $BH.BinaryHeap();
    
    binHeap.insert(5);
    binHeap.insert(4);
    binHeap.insert(3);
    binHeap.insert(2);
    binHeap.insert(1);
    binHeap.insert(0);
    
    logger.dir(binHeap.getPositions());
    expect((<any>binHeap).getNodePosition(0)).to.equal(0);
    expect((<any>binHeap).getNodePosition(1)).to.equal(2);
    expect((<any>binHeap).getNodePosition(2)).to.equal(1);
    expect((<any>binHeap).getNodePosition(3)).to.equal(4);
    expect((<any>binHeap).getNodePosition(4)).to.equal(5);
    expect((<any>binHeap).getNodePosition(5)).to.equal(3);
  });
  
  
  it('Checks that every node has at least position 0', () => {
    binHeap = new $BH.BinaryHeap();
    var i = 0;
    
    while ( i < 5000 ) {
      binHeap.insert( i++ );
    }
    
    while ( i ) {
      expect((<any>binHeap).getNodePosition(--i)).to.be.at.least(0);
    }
  });
  
});