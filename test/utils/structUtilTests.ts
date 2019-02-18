import * as chai from 'chai';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';
import * as $SU from '../../src/utils/structUtils';
import * as $I from '../../src/io/input/JSONInput';
import * as $G from '../../src/core/Graph';


var expect = chai.expect;
chai.use(sinonChai);


describe('Datastructure Utils Tests - ', () => {

  describe('Merge Array tests', () => {

    test('should only accept arrays as arg inputs', () => {
      var a = [1, 2, 3],
        b = {},
        c = "bla",
        d = 55,
        e = undefined;

      expect($SU.mergeArrays.bind($SU, [a, b])).toThrowError('Will only mergeArrays arrays');
      expect($SU.mergeArrays.bind($SU, [a, c])).toThrowError('Will only mergeArrays arrays');
      expect($SU.mergeArrays.bind($SU, [a, d])).toThrowError('Will only mergeArrays arrays');
      expect($SU.mergeArrays.bind($SU, [a, e])).toThrowError('Will only mergeArrays arrays');
    });


    test(
      'should correctly mergeArrays two arrays of completely different numbers',
      () => {
        var a = [1, 2, 3],
            b = [4, 5, 6],
            result = a.concat(b);

        expect($SU.mergeArrays([a, b])).toEqual(result);
      }
    );


    test('should not give the same results for overlapping number inputs', () => {
      var a = [1, 2, 3],
        b = [3, 5, 6],
        result = a.concat(b);

      var merge = $SU.mergeArrays([a, b]);
      expect(merge).not.toEqual(result);
      expect(merge.length).toBe(5);
    });


    test(
      'should correctly mergeArrays two arrays of completely different strings',
      () => {
        var a = ["a", "b", "c"],
          b = ["d", "e", "f"],
          result = a.concat(b);

        expect($SU.mergeArrays([a, b])).toEqual(result);
      }
    );


    test('should not give the same results for overlapping string inputs', () => {
      var a = ["a", "b", "c"],
        b = ["c", "e", "f"],
        result = a.concat(b);

      var merge = $SU.mergeArrays([a, b]);
      expect(merge).not.toEqual(result);
      expect(merge.length).toBe(5);
    });


    test('should "mergeArrays" a list of empty arrays into an empty array', () => {
      var a = [],
          b = [],
          c = [];

      expect($SU.mergeArrays([a, b, c])).toEqual([]);
    });

    
    test('should take and use a callback on each entry', () => {
      var merge_spy = sinon.spy($SU.mergeArrays),
          a = [1, 2, 3],
          b = [3, 4, 5],
          r = a.concat(b),
          cb = function(arg) { return arg },
          cb_spy = sinon.spy(cb),
          merge = merge_spy([a, b], cb_spy);

      expect(merge).not.toEqual(r);
      expect(merge.length).toBe(5);
      expect(merge_spy).to.have.been.calledOnce;
      expect(cb_spy.callCount).toBe(6);
    });


    test(
      'should correctly mergeArrays two object arrays given certain IDs',
      () => {
        var merge_spy = sinon.spy($SU.mergeArrays),
            a = [{id: 1}, {id: 2}, {id: 3}],
            b = [{id: 3}, {id: 4}, {id: 5}],
            r = a.concat(b),
            cb = function(arg) { return arg.id },
            cb_spy = sinon.spy(cb),
            merge = merge_spy([a, b], cb_spy);

        expect(merge).not.toEqual(r);
        expect(merge.length).toBe(5);
        expect(merge_spy).to.have.been.calledOnce;
        expect(cb_spy.callCount).toBe(6);
      }
    );


    test(
      'should mergeArrays two object arrays by their toString method, if no CB given',
      () => {
        var a = [{id: 1}, {id: 2}, {id: 3}],
            b = [{id: 4}, {id: 5}, {id: 6}],
            r = a.concat(b),
            merge = $SU.mergeArrays([a, b]);

        expect(merge).not.toEqual(r);
        expect(merge.length).toBe(1);
      }
    );

  });

  describe('Merge Array no duplicates tests', () => {
    test('should merge two arrays with only one or no elements', () => {
      var a = [0],
          b = [1],
          c = [2],
          d = [0],
          e = [];

      expect($SU.mergeOrderedArraysNoDups(a, b)).toEqual([0, 1]);
      expect($SU.mergeOrderedArraysNoDups(b, b)).toEqual([1]);
      expect($SU.mergeOrderedArraysNoDups(e, b)).toEqual([1]);
      expect($SU.mergeOrderedArraysNoDups(e, e)).toEqual([]);
      expect($SU.mergeOrderedArraysNoDups(d, e)).toEqual([0]);
    });
    test('should merge two more complex arrays', () => {
      var a = [0,1,2,4,5,6,10,11],
          b = [0,2,4,5,7,9,10,11,12];

      expect($SU.mergeOrderedArraysNoDups(a, b)).toEqual([0,1,2,4,5,6,7,9,10,11,12]);
      expect($SU.mergeOrderedArraysNoDups(b, b)).toEqual(b);
    });
  });

  describe('Merge Object tests', () => {

    test('should only accept objects as arg inputs', () => {
      var a = {},
          b = [1, 2, 3],
          c = "bla",
          d = 55,
          e = undefined,
          f = new Date;

      expect($SU.mergeObjects.bind($SU, [a, b])).toThrowError('Will only take objects as inputs');
      expect($SU.mergeObjects.bind($SU, [a, c])).toThrowError('Will only take objects as inputs');
      expect($SU.mergeObjects.bind($SU, [a, d])).toThrowError('Will only take objects as inputs');
      expect($SU.mergeObjects.bind($SU, [a, e])).toThrowError('Will only take objects as inputs');
      expect($SU.mergeObjects.bind($SU, [a, f])).toThrowError('Will only take objects as inputs');
    });


    test('should merge two empty objects into an emtpy result object', () => {
      var a = {},
          b = {};

      expect($SU.mergeObjects([a, b])).toEqual({});
    });


    test(
      'should merge two objects with disjoint key sets into an expected result object',
      () => {
        var a = {1: 'bla', 2: 'hoo'},
          b = {3: 'ya', 4: true};

        expect($SU.mergeObjects([a, b])).toEqual({1: 'bla', 2: 'hoo', 3: 'ya', 4: true});
      }
    );


    test(
      'should overwrite duplicate keys with those from the latter objects',
      () => {
        var a = {1: 'bla', 2: 'hoo'},
            b = {2: 'ya', 4: true},
            c = {'yi': 'haa', 4: false};

        expect($SU.mergeObjects([a, b, c])).toEqual({1: 'bla', 2: 'ya', 'yi': 'haa', 4: false});
      }
    );

  });
  
  
  describe('Clone Object tests', () => {
    
    test('should return whatever non-object is passed in', () => {
      expect($SU.clone(undefined)).toBeUndefined();
      expect($SU.clone(true)).toBe(true);
      expect($SU.clone(55)).toBe(55);
      expect($SU.clone('bla')).toBe('bla');
      var date = +new Date;
      expect($SU.clone(date)).toBe(date);

      var arr = [1, 2, 3, [4, 5, 6]];
      // check if all entries are the same
      expect($SU.clone( arr )).toEqual(arr);

      // check that the reference is not the same
      expect($SU.clone( arr )).not.toBe(arr);
    });
    
    
    test('should correctly clone an object', () => {
      var obj = {1: {bla: 'hoo'}, 2: true, 'false': true};
      expect($SU.clone(obj)).toEqual(obj);
    });
    
  });

});