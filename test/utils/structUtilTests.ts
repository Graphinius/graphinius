/// <reference path="../../typings/tsd.d.ts" />

import * as chai from 'chai';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';
import * as $DS from '../../src/utils/structUtils';

var expect = chai.expect;
chai.use(sinonChai);


describe('Datastructure Utils Tests - ', () => {

  describe('Merge tests', () => {

    it('should only accept arrays as arg inputs', () => {
      var a = [1, 2, 3],
        b = {},
        c = "bla",
        d = 55,
        e = undefined;

      expect($DS.merge.bind($DS, [a, b])).to.throw('Will only merge arrays');
      expect($DS.merge.bind($DS, [a, c])).to.throw('Will only merge arrays');
      expect($DS.merge.bind($DS, [a, d])).to.throw('Will only merge arrays');
      expect($DS.merge.bind($DS, [a, e])).to.throw('Will only merge arrays');
    });


    it('should correctly merge two arrays of completely different numbers', () => {
      var a = [1, 2, 3],
          b = [4, 5, 6],
          result = a.concat(b);

      expect($DS.merge([a, b])).to.deep.equal(result);
    });


    it('should not give the same results for overlapping number inputs', () => {
      var a = [1, 2, 3],
        b = [3, 5, 6],
        result = a.concat(b);

      var merge = $DS.merge([a, b]);
      expect(merge).not.to.deep.equal(result);
      expect(merge.length).to.equal(5);
    });


    it('should correctly merge two arrays of completely different strings', () => {
      var a = ["a", "b", "c"],
        b = ["d", "e", "f"],
        result = a.concat(b);

      expect($DS.merge([a, b])).to.deep.equal(result);
    });


    it('should not give the same results for overlapping string inputs', () => {
      var a = ["a", "b", "c"],
        b = ["c", "e", "f"],
        result = a.concat(b);

      var merge = $DS.merge([a, b]);
      expect(merge).not.to.deep.equal(result);
      expect(merge.length).to.equal(5);
    });


    it('should "merge" a list of empty arrays into an empty array', () => {
      var a = [],
          b = [],
          c = [];

      expect($DS.merge([a, b, c])).to.deep.equal([]);
    });

    
    it('should take and use a callback on each entry', () => {
      var merge_spy = sinon.spy($DS.merge),
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


    it('should correctly merge two object arrays given certain IDs', () => {
      var merge_spy = sinon.spy($DS.merge),
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


    it('should merge two object arrays by their toString method, if no CB given', () => {
      var a = [{id: 1}, {id: 2}, {id: 3}],
          b = [{id: 4}, {id: 5}, {id: 6}],
          r = a.concat(b),
          merge = $DS.merge([a, b]);

      expect(merge).not.to.deep.equal(r);
      expect(merge.length).to.equal(1);
    });

  });

});