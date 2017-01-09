/// <reference path="../../typings/tsd.d.ts" />

import * as chai from 'chai';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';
import * as $SU from '../../src/utils/structUtils';
import * as $I from '../../src/io/input/JSONInput';
import * as $G from '../../src/core/Graph';


var expect = chai.expect;
chai.use(sinonChai);
const toy_graph = "./test/test_data/search_graph.json",
      real_graph = "./test/test_data/real_graph.json",
      REAL_GRAPH_NR_NODES = 6204,
      REAL_GRAPH_NR_EDGES = 18550;


describe('Datastructure Utils Tests - ', () => {

  describe('Merge Array tests', () => {

    it('should only accept arrays as arg inputs', () => {
      var a = [1, 2, 3],
        b = {},
        c = "bla",
        d = 55,
        e = undefined;

      expect($SU.mergeArrays.bind($SU, [a, b])).to.throw('Will only mergeArrays arrays');
      expect($SU.mergeArrays.bind($SU, [a, c])).to.throw('Will only mergeArrays arrays');
      expect($SU.mergeArrays.bind($SU, [a, d])).to.throw('Will only mergeArrays arrays');
      expect($SU.mergeArrays.bind($SU, [a, e])).to.throw('Will only mergeArrays arrays');
    });


    it('should correctly mergeArrays two arrays of completely different numbers', () => {
      var a = [1, 2, 3],
          b = [4, 5, 6],
          result = a.concat(b);

      expect($SU.mergeArrays([a, b])).to.deep.equal(result);
    });


    it('should not give the same results for overlapping number inputs', () => {
      var a = [1, 2, 3],
        b = [3, 5, 6],
        result = a.concat(b);

      var merge = $SU.mergeArrays([a, b]);
      expect(merge).not.to.deep.equal(result);
      expect(merge.length).to.equal(5);
    });


    it('should correctly mergeArrays two arrays of completely different strings', () => {
      var a = ["a", "b", "c"],
        b = ["d", "e", "f"],
        result = a.concat(b);

      expect($SU.mergeArrays([a, b])).to.deep.equal(result);
    });


    it('should not give the same results for overlapping string inputs', () => {
      var a = ["a", "b", "c"],
        b = ["c", "e", "f"],
        result = a.concat(b);

      var merge = $SU.mergeArrays([a, b]);
      expect(merge).not.to.deep.equal(result);
      expect(merge.length).to.equal(5);
    });


    it('should "mergeArrays" a list of empty arrays into an empty array', () => {
      var a = [],
          b = [],
          c = [];

      expect($SU.mergeArrays([a, b, c])).to.deep.equal([]);
    });

    
    it('should take and use a callback on each entry', () => {
      var merge_spy = sinon.spy($SU.mergeArrays),
          a = [1, 2, 3],
          b = [3, 4, 5],
          r = a.concat(b),
          cb = function(arg) { return arg },
          cb_spy = sinon.spy(cb),
          merge = merge_spy([a, b], cb_spy);

      expect(merge).not.to.deep.equal(r);
      expect(merge.length).to.equal(5);
      expect(merge_spy).to.have.been.calledOnce;
      expect(cb_spy.callCount).to.equal(6);
    });


    it('should correctly mergeArrays two object arrays given certain IDs', () => {
      var merge_spy = sinon.spy($SU.mergeArrays),
          a = [{id: 1}, {id: 2}, {id: 3}],
          b = [{id: 3}, {id: 4}, {id: 5}],
          r = a.concat(b),
          cb = function(arg) { return arg.id },
          cb_spy = sinon.spy(cb),
          merge = merge_spy([a, b], cb_spy);

      expect(merge).not.to.deep.equal(r);
      expect(merge.length).to.equal(5);
      expect(merge_spy).to.have.been.calledOnce;
      expect(cb_spy.callCount).to.equal(6);
    });


    it('should mergeArrays two object arrays by their toString method, if no CB given', () => {
      var a = [{id: 1}, {id: 2}, {id: 3}],
          b = [{id: 4}, {id: 5}, {id: 6}],
          r = a.concat(b),
          merge = $SU.mergeArrays([a, b]);

      expect(merge).not.to.deep.equal(r);
      expect(merge.length).to.equal(1);
    });

  });


  describe('Merge Object tests', () => {

    it('should only accept objects as arg inputs', () => {
      var a = {},
          b = [1, 2, 3],
          c = "bla",
          d = 55,
          e = undefined,
          f = new Date;

      expect($SU.mergeObjects.bind($SU, [a, b])).to.throw('Will only take objects as inputs');
      expect($SU.mergeObjects.bind($SU, [a, c])).to.throw('Will only take objects as inputs');
      expect($SU.mergeObjects.bind($SU, [a, d])).to.throw('Will only take objects as inputs');
      expect($SU.mergeObjects.bind($SU, [a, e])).to.throw('Will only take objects as inputs');
      expect($SU.mergeObjects.bind($SU, [a, f])).to.throw('Will only take objects as inputs');
    });


    it('should merge two empty objects into an emtpy result object', () => {
      var a = {},
          b = {};

      expect($SU.mergeObjects([a, b])).to.deep.equal({});
    });


    it('should merge two objects with disjoint key sets into an expected result object', () => {
      var a = {1: 'bla', 2: 'hoo'},
        b = {3: 'ya', 4: true};

      expect($SU.mergeObjects([a, b])).to.deep.equal({1: 'bla', 2: 'hoo', 3: 'ya', 4: true});
    });


    it('should overwrite duplicate keys with those from the latter objects', () => {
      var a = {1: 'bla', 2: 'hoo'},
          b = {2: 'ya', 4: true},
          c = {'yi': 'haa', 4: false};

      expect($SU.mergeObjects([a, b, c])).to.deep.equal({1: 'bla', 2: 'ya', 'yi': 'haa', 4: false});
    });

  });
  
  
  describe('Clone Object tests', () => {
    
    it('should return whatever non-object is passed in', () => {
      expect($SU.clone(undefined)).to.be.undefined;
      expect($SU.clone(true)).to.be.true;
      expect($SU.clone(55)).to.equal(55);
      expect($SU.clone('bla')).to.equal('bla');
      var date = +new Date;
      expect($SU.clone(date)).to.equal(date);

      var arr = [1, 2, 3, [4, 5, 6]];
      // check if all entries are the same
      expect($SU.clone( arr )).to.deep.equal( arr );

      // check that the reference is not the same
      expect($SU.clone( arr )).not.to.equal( arr );
    });
    
    
    it('should correctly clone an object', () => {
      var obj = {1: {bla: 'hoo'}, 2: true, 'false': true};
      expect($SU.clone(obj)).to.deep.equal(obj);
    });
    
  });
  

});