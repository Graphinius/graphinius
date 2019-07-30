import * as $CB from '../../src/utils/CallbackUtils';
import * as $BH from '../../src/datastructs/BinaryHeap';
import { Logger } from '../../src/utils/Logger';
const logger = new Logger();

let binHeap : $BH.BinaryHeap = null,
    Mode    = $BH.BinaryHeapMode;


describe('BINARY HEAP TESTS - ', () => {

  describe('Basic instantiation tests - ', () => {

    it('should correctly instantiate a bin heap', () => {
      binHeap = new $BH.BinaryHeap();
      expect(binHeap).not.toBe(null);
    });


    it('should correctly initialize the heap to size ZERO', () => {
      binHeap = new $BH.BinaryHeap();
      expect(binHeap.size()).toEqual(0);
    });


    it('should correctly instantiate a bin heap with default _mode MIN', () => {
      binHeap = new $BH.BinaryHeap();
      expect(binHeap.getMode()).toEqual(Mode.MIN);
    });


    it('should correctly instantiate a bin heap with _mode set in constructor', () => {
      binHeap = new $BH.BinaryHeap(Mode.MAX);
      expect(binHeap.getMode()).toEqual(Mode.MAX);
    });


    it('should set a simple _eval function on its own', () => {
      binHeap = new $BH.BinaryHeap();
      expect(binHeap.getEvalPriorityFun()).toBeInstanceOf(Function);
    });
    
    
    it('should correctly set a default evalObjID function just returning an object', () => {
      binHeap = new $BH.BinaryHeap();
      expect(binHeap.getEvalObjIDFun()).toBeInstanceOf(Function);
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
      expect(binHeap.evalInputScore(55)).toEqual(55);
    });


    it('should accept negative Integers as input and evaluate to that same Integer', () => {
      expect(binHeap.evalInputScore(-55)).toEqual(-55);
    });


    it('should accept Floats as input and evaluate to their Integer value', () => {
      expect(binHeap.evalInputScore(55.55)).toEqual(55);
    });


    it('should accept negative Floats as input and evaluate to their Integer value', () => {
      expect(binHeap.evalInputScore(-55.55)).toEqual(-55);
    });


    it('should accept String encoded Integers as input and evaluate to their Integer value', () => {
      expect(binHeap.evalInputScore("55.55")).toEqual(55);
    });


    it('should accept String encoded negative Integers as input and evaluate to their Integer value', () => {
      expect(binHeap.evalInputScore("-55.55")).toEqual(-55);
    });


    it('should accept String encoded Floats as input and evaluate to their Integer value', () => {
      expect(binHeap.evalInputScore("55.55")).toEqual(55);
    });


    it('should accept String encoded negative Floats as input and evaluate to their Integer value', () => {
      expect(binHeap.evalInputScore("-55.55")).toEqual(-55);
    });


    it('should not accept booleans as input values (makes no sense...) ', () => {
      expect(binHeap.evalInputScore(true)).toBeNaN;
      expect(binHeap.evalInputScore(false)).toBeNaN;
    });


    it('should not accept strings that do not encode numbers', () => {
      expect(binHeap.evalInputScore("blahoo")).toBeNaN;
    });


    it('should not accept arrays as input', () => {
      expect(binHeap.evalInputScore([1, 2, 3])).toBeNaN;
    });


    it('should not accept objects as input', () => {
      expect(binHeap.evalInputScore({1: 1, 2: 2, 3: 3})).toBeNaN;
    });


    it('should not accept functions as input', () => {
      expect(binHeap.evalInputScore(()=>{})).toBeNaN;
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
      expect(binHeap.evalInputObjID("bla")).toEqual("bla");
      expect(binHeap.evalInputObjID(55)).toEqual(55);
      expect(binHeap.evalInputObjID(true)).toEqual(true);
      expect(binHeap.evalInputObjID([1,2,3,4])).toEqual([1,2,3,4]);
      expect(binHeap.evalInputObjID({a: 'bla', b: 'hoo'})).toEqual({a: 'bla', b: 'hoo'});
    });


    it('should take a custom evalObjID function', () => {
      let evalObjIDFunc = (obj) => {
        return obj._id;
      };
      binHeap = new $BH.BinaryHeap(Mode.MIN, undefined, evalObjIDFunc);

      expect(binHeap.evalInputObjID("blahoo")).toBeUndefined;
      expect(binHeap.evalInputObjID({_id: 'bla', _name: 'hoo'})).toEqual('bla');
    });


  });


  /**
   * CUSTOM _eval functions
   */
  describe('Should take a customized eval function, depending on our needs - ', () => {

    it('should take a custom eval function', () => {
      let evalFunc = (obj) => {
        return NaN;
      };
      binHeap = new $BH.BinaryHeap(Mode.MIN, evalFunc);

      expect(binHeap.evalInputScore(55)).toBeNaN;
    });


    it('eval function that evaluates to the second element of an array...', () => {
      let evalFunc = (obj) => {
        if ( !Array.isArray((obj)) || obj.length < 2 ) {
          return NaN;
        }
        return parseInt(obj[1]);
      };
      binHeap = new $BH.BinaryHeap(Mode.MIN, evalFunc);

      expect(binHeap.evalInputScore(55)).toBeNaN;
      expect(binHeap.evalInputScore("55")).toBeNaN;
      expect(binHeap.evalInputScore([])).toBeNaN;
      expect(binHeap.evalInputScore([1])).toBeNaN;
      expect(binHeap.evalInputScore([1, 2])).toEqual(2);
    });
  });


  describe('Adding / removing elements and peek tests - ', () => {

    beforeEach(() => {
      binHeap = new $BH.BinaryHeap();
    });


    it('should refuse to add an element whose priority evaluates to NaN', () => {
      expect(binHeap.insert.bind(binHeap, "blahoo")).toThrow("Cannot insert object without numeric priority.");
    });


    it('should add a valid element to the internal array', () => {
      let old_size = binHeap.size();
      binHeap.insert(1);
      expect(binHeap.size()).toEqual(old_size + 1);
    });


    it('should throw an error when trying to remove an invalid object', () => {
      expect(binHeap.remove.bind(binHeap, undefined)).toThrow('Object invalid.');
    });


    it('should return undefined when retrieving a non-existing, valid object', () => {
      expect(binHeap.remove(55)).toBeUndefined;
    });


    it('should remove an existing element from the internal array', () => {
      binHeap.insert(55);
      expect(binHeap.remove(55)).toEqual(55);
    });


    it('valid object removal, this time with custom objID and evalPriority functions', () => {
      let evalObjID = (obj) => {
        return obj.__blahoo._id;
      };
      let evalObjPriority = (obj) => {
        return obj.__priority;
      };
      binHeap = new $BH.BinaryHeap(undefined, evalObjPriority, evalObjID);
      let obj = {
        __blahoo: {
          _id: 'yihaa'
        },
        __priority: 55
      };
      let old_size = binHeap.size();
      binHeap.insert(obj);
      expect(binHeap.size()).toEqual(old_size + 1);
      expect(binHeap.remove(obj)).toEqual(obj);
      expect(binHeap.size()).toEqual(old_size);
    });


    it('should give undefined if we peek into an empty heap', () => {
      expect(binHeap.peek()).toBeUndefined;
    });


    it('should give us the correct object if we peek into a heap', () => {
      let evalObjID = (obj) => {
        return obj._id;
      };
      let evalObjPriority = (obj) => {
        return obj._priority;
      };
      binHeap = new $BH.BinaryHeap(undefined, evalObjPriority, evalObjID);
      binHeap.insert({_id: 'bla', _priority: 55});
      expect(binHeap.peek()).toEqual({_id: 'bla', _priority: 55});
    });

  });


  describe('_position map tests - ', () => {

    it('should produce correct _position maps for a small positive integer sequence', () => {
      binHeap = new $BH.BinaryHeap();
      let controlMap;
      expect( binHeap.getPositions() ).toEqual({});
      
      binHeap.insert(155);
      controlMap =  { '155': { score: 155, position: 0 } };
      expect( binHeap.getPositions() ).toEqual(controlMap);      

      binHeap.insert(0);
      controlMap =  { '0': { score: 0, position: 0 },
                      '155': { score: 155, position: 1 } };
      expect( binHeap.getPositions() ).toEqual(controlMap); 

      binHeap.insert(15);
      controlMap =  { '0': { score: 0, position: 0 },
                      '15': { score: 15, position: 2 },
                      '155': { score: 155, position: 1 } };
      expect( binHeap.getPositions() ).toEqual(controlMap); 

      binHeap.insert(5);
      controlMap =  { '0': { score: 0, position: 0 },
                      '5': { score: 5, position: 1 },
                      '15': { score: 15, position: 2 },
                      '155': { score: 155, position: 3 } };    
      expect( binHeap.getPositions() ).toEqual(controlMap);

      binHeap.insert(1);
      controlMap =  { '0': { score: 0, position: 0 },
                      '1': { score: 1, position: 1 },
                      '5': { score: 5, position: 4 },
                      '15': { score: 15, position: 2 },
                      '155': { score: 155, position: 3 } };    
      expect( binHeap.getPositions() ).toEqual(controlMap);

      expect(binHeap.pop()).toEqual(0);
      controlMap =  { '1': { score: 1, position: 0 },
                      '5': { score: 5, position: 1 },
                      '15': { score: 15, position: 2 },
                      '155': { score: 155, position: 3 } };
      expect( binHeap.getPositions() ).toEqual(controlMap);
    

      expect(binHeap.pop()).toEqual(1);
      controlMap =  { '5': { score: 5, position: 0 },
                      '15': { score: 15, position: 2 },
                      '155': { score: 155, position: 1 } };    
      expect( binHeap.getPositions() ).toEqual(controlMap);

      expect(binHeap.pop()).toEqual(5);
      controlMap =  { '15': { score: 15, position: 0 },
                      '155': { score: 155, position: 1 } };
      expect( binHeap.getPositions() ).toEqual(controlMap);

      expect(binHeap.pop()).toEqual(15);
      controlMap =  { '155': { score: 155, position: 0 } };    
      expect( binHeap.getPositions() ).toEqual(controlMap);

      expect(binHeap.pop()).toEqual(155);
      controlMap = {};    
      expect( binHeap.getPositions() ).toEqual(controlMap);
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
      expect(binHeap.peek()).toEqual(1);
    });
    
    
    it('should trickle up a smaller element in a MIN HEAP, with ZERO', () => {
      binHeap = new $BH.BinaryHeap();

      binHeap.insert(155);
      binHeap.insert(0);
      binHeap.insert(15);
      binHeap.insert(5);
      binHeap.insert(1);
      
      logger.log("\n ##### POPPING ##### \n");
      expect(binHeap.pop()).toEqual(0);
      expect(binHeap.pop()).toEqual(1);
      expect(binHeap.pop()).toEqual(5);
      expect(binHeap.pop()).toEqual(15);
      expect(binHeap.pop()).toEqual(155);
    });


    it('should trickle up a larger element in a MAX HEAP', () => {
      binHeap = new $BH.BinaryHeap(Mode.MAX);
      binHeap.insert(1);
      binHeap.insert(5);
      binHeap.insert(55);
      binHeap.insert(75);
      binHeap.insert(115);
      
      expect(binHeap.peek()).toEqual(115);
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
      expect(binHeap.getArray()).toEqual([5, 9, 11, 14, 18, 19, 21, 33, 17, 27]);
      
      binHeap.insert(7);
      expect(binHeap.getArray()).toEqual([5, 7, 11, 14, 9, 19, 21, 33, 17, 27, 18]);
      
      expect(binHeap.pop()).toEqual(5);
      expect(binHeap.getArray()).toEqual([7, 9, 11, 14, 18, 19, 21, 33, 17, 27]);
      
      expect(binHeap.pop()).toEqual(7);
      expect(binHeap.getArray()).toEqual([9, 14, 11, 17, 18, 19, 21, 33, 27]);
      
      expect(binHeap.pop()).toEqual(9);
      expect(binHeap.getArray()).toEqual([11, 14, 19, 17, 18, 27, 21, 33]);
      
      expect(binHeap.pop()).toEqual(11);
      expect(binHeap.getArray()).toEqual([14, 17, 19, 33, 18, 27, 21]);
      
      expect(binHeap.pop()).toEqual(14);
      expect(binHeap.getArray()).toEqual([17, 18, 19, 33, 21, 27]);
      
      expect(binHeap.pop()).toEqual(17);
      expect(binHeap.getArray()).toEqual([18, 21, 19, 33, 27]);
      
      expect(binHeap.pop()).toEqual(18);
      expect(binHeap.getArray()).toEqual([19, 21, 27, 33]);
      
      expect(binHeap.pop()).toEqual(19);
      expect(binHeap.getArray()).toEqual([21, 33, 27]);
      
      expect(binHeap.pop()).toEqual(21);
      expect(binHeap.getArray()).toEqual([27, 33]);
      
      expect(binHeap.pop()).toEqual(27);
      expect(binHeap.getArray()).toEqual([33]);
      
      expect(binHeap.pop()).toEqual(33);
      expect(binHeap.getArray()).toEqual([]);
    });
    
    
    it('should trickle up correctly upon removing an object, MAX HEAP', () => {
      binHeap = new $BH.BinaryHeap(Mode.MAX);
      binHeap.insert(5);
      binHeap.insert(1);
      binHeap.insert(16);
      binHeap.insert(7);
      binHeap.insert(8);
    
      expect(binHeap.remove(16)).toEqual(16);
      expect(binHeap.pop()).toEqual(8);
      expect(binHeap.pop()).toEqual(7);
      expect(binHeap.pop()).toEqual(5);
      expect(binHeap.pop()).toEqual(1);
    });
    
    
    it('MIN heap should work with negative integers', () => {
      binHeap = new $BH.BinaryHeap(Mode.MIN);
      binHeap.insert(-5);
      binHeap.insert(-1);
      binHeap.insert(-16);
      binHeap.insert(-7);
      binHeap.insert(-8);
    
      expect(binHeap.remove(16)).toBeUndefined;
      
      expect(binHeap.pop()).toEqual(-16);
      expect(binHeap.pop()).toEqual(-8);
      expect(binHeap.pop()).toEqual(-7);
      expect(binHeap.pop()).toEqual(-5);
      expect(binHeap.pop()).toEqual(-1);
    });
    
    
    it('MAX heap should work with negative integers', () => {
      binHeap = new $BH.BinaryHeap(Mode.MAX);
      binHeap.insert(-5);
      binHeap.insert(-1);
      binHeap.insert(-16);
      binHeap.insert(-7);
      binHeap.insert(-8);
    
      expect(binHeap.remove(16)).toBeUndefined;
      
      expect(binHeap.pop()).toEqual(-1);
      expect(binHeap.pop()).toEqual(-5);
      expect(binHeap.pop()).toEqual(-7);
      expect(binHeap.pop()).toEqual(-8);
      expect(binHeap.pop()).toEqual(-16);
    });
    
    
    it('MIN heap should work with mixed integers plus zero', () => {
      binHeap = new $BH.BinaryHeap(Mode.MIN);
      binHeap.insert(0);
      binHeap.insert(-5);
      binHeap.insert(1);
      binHeap.insert(-16);
      binHeap.insert(7);
      binHeap.insert(-8);
      
      expect(binHeap.pop()).toEqual(-16);
      expect(binHeap.pop()).toEqual(-8);
      expect(binHeap.pop()).toEqual(-5);
      expect(binHeap.pop()).toEqual(0);
      expect(binHeap.pop()).toEqual(1);
      expect(binHeap.pop()).toEqual(7);
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
      
      expect(binHeap.find(-16)).toEqual(-16);
      expect(binHeap.find(-8)).toEqual(-8);
      expect(binHeap.find(-5)).toEqual(-5);
      expect(binHeap.find(0)).toEqual(0);
      expect(binHeap.find(0)).toEqual(0);
      expect(binHeap.find(0)).toEqual(0);
      expect(binHeap.find(1)).toEqual(1);
      expect(binHeap.find(7)).toEqual(7);
    });
    

    it('tests MIN heap on a slightly larger example and floats', () => {      
      let evalPriority = (obj:any) => {
        if ( typeof obj !== 'number' && typeof obj !== 'string') {
          return NaN;
        }
        return typeof obj === 'number' ? obj : parseFloat(obj);
      };
      binHeap = new $BH.BinaryHeap(Mode.MIN, evalPriority);
      
      for ( let i = 0; i < 5000; i++ ) {
        binHeap.insert((Math.random()*1000 - 500));
      }
      
      let binArray = binHeap.getArray(),
          ith = 0,
          left_child_idx = 0,
          right_child_idx = 0;
      for ( let i = 0; i < binArray.length; i++ ) {
        ith = binArray[i];
        left_child_idx = (i+1)*2-1;
        right_child_idx = (i+1)*2;
        if ( left_child_idx < binArray.length ) {
          expect(ith).toBeLessThanOrEqual(binArray[left_child_idx]);
        }
        if ( right_child_idx < binArray.length ) {
          expect(ith).toBeLessThanOrEqual(binArray[right_child_idx]);
        }
      }
       
      let last = Number.NEGATIVE_INFINITY,
          current,
          heap_size = binHeap.size();
      for ( let i = 0; i < 5000; i++ ) {
        current = binHeap.pop();
        if ( typeof current !== 'undefined') {
          expect(current).toBeGreaterThanOrEqual(last);
          expect(binHeap.size()).toEqual(heap_size - 1);
          last = current;
          --heap_size;
        }
      }
      
    });


    it('tests MAX heap on a slightly larger example', () => {
      binHeap = new $BH.BinaryHeap(Mode.MAX);
      for ( let i = 0; i < 5000; i++ ) {
        binHeap.insert((Math.random()*1000 - 500)|0);
      }
      
      let binArray = binHeap.getArray(),
          ith = 0,
          left_child_idx = 0,
          right_child_idx = 0;
      for ( let i = 0; i < binArray.length; i++ ) {
        ith = binArray[i];
        left_child_idx = (i+1)*2-1;
        right_child_idx = (i+1)*2;
        if ( left_child_idx < binArray.length ) {
          expect(ith).toBeGreaterThanOrEqual(binArray[left_child_idx]);
        }
        if ( right_child_idx < binArray.length ) {
          expect(ith).toBeGreaterThanOrEqual(binArray[right_child_idx]);
        }
      }
      
      let last = Number.POSITIVE_INFINITY,
          current,
          heap_size = binHeap.size();
      for ( let i = 0; i < 5000; i++ ) {
        if ( typeof current !== 'undefined') {
          current = binHeap.pop();
          expect(current).toBeLessThanOrEqual(last);
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
      let i = 0;
      while ( i < 30000 ) {
        binHeap.insert( i++ );
      }      
      while ( i ) {
        expect(binHeap.find(--i)).toEqual(i);
      }      
    });
    
    
    it('should run 30000 removes in just a few milliseconds (if the O(1) algorithm works...)', () => {
      binHeap = new $BH.BinaryHeap(Mode.MIN);
      let i = 0;
      while ( i < 30000 ) {
        binHeap.insert( i++ );
      }
      while ( i ) {
        expect(binHeap.remove(--i)).toEqual(i);
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
    expect((<any>binHeap).getNodePosition(0)).toEqual(0);
    expect((<any>binHeap).getNodePosition(1)).toEqual(2);
    expect((<any>binHeap).getNodePosition(2)).toEqual(1);
    expect((<any>binHeap).getNodePosition(3)).toEqual(4);
    expect((<any>binHeap).getNodePosition(4)).toEqual(5);
    expect((<any>binHeap).getNodePosition(5)).toEqual(3);
  });
  
  
  it('Checks that every node has at least position 0', () => {
    binHeap = new $BH.BinaryHeap();
    let i = 0;
    
    while ( i < 5000 ) {
      binHeap.insert( i++ );
    }
    
    while ( i ) {
      expect((<any>binHeap).getNodePosition(--i)).toBeGreaterThanOrEqual(0);
    }
  });
  
});