import * as $SU from "@/utils/StructUtils";
import { BaseEdge } from "@/core/base/BaseEdge";
import { BaseNode } from "@/core/base/BaseNode";
import { BaseGraph } from "@/core/base/BaseGraph";
import { Logger } from "@/utils/Logger";

const logger = new Logger();

/**
 *
 */
describe("Datastructure Utils Tests - ", () => {
  describe("Merge Array tests", () => {
    it("should only accept arrays as arg inputs", () => {
      let a = [1, 2, 3],
        b = {},
        c = "bla",
        d = 55,
        e = undefined;

      expect($SU.mergeArrays.bind($SU, [a, b])).toThrowError("Will only mergeArrays arrays");
      expect($SU.mergeArrays.bind($SU, [a, c])).toThrowError("Will only mergeArrays arrays");
      expect($SU.mergeArrays.bind($SU, [a, d])).toThrowError("Will only mergeArrays arrays");
      expect($SU.mergeArrays.bind($SU, [a, e])).toThrowError("Will only mergeArrays arrays");
    });

    it("should correctly mergeArrays two arrays of completely different numbers", () => {
      let a = [1, 2, 3],
        b = [4, 5, 6],
        result = a.concat(b);

      expect($SU.mergeArrays([a, b])).toEqual(result);
    });

    it("should not give the same results for overlapping number inputs", () => {
      let a = [1, 2, 3],
        b = [3, 5, 6],
        result = a.concat(b);

      let merge = $SU.mergeArrays([a, b]);
      expect(merge).not.toEqual(result);
      expect(merge.length).toBe(5);
    });

    it("should correctly mergeArrays two arrays of completely different strings", () => {
      let a = ["a", "b", "c"],
        b = ["d", "e", "f"],
        result = a.concat(b);

      expect($SU.mergeArrays([a, b])).toEqual(result);
    });

    it("should not give the same results for overlapping string inputs", () => {
      let a = ["a", "b", "c"],
        b = ["c", "e", "f"],
        result = a.concat(b);

      let merge = $SU.mergeArrays([a, b]);
      expect(merge).not.toEqual(result);
      expect(merge.length).toBe(5);
    });

    it('should "mergeArrays" a list of empty arrays into an empty array', () => {
      let a = [],
        b = [],
        c = [];

      expect($SU.mergeArrays([a, b, c])).toEqual([]);
    });

    /**
     * @todo extract out all spy / mock tests
     */

    it("should take and use a callback on each entry", () => {
      let a = [1, 2, 3],
        b = [3, 4, 5],
        r = a.concat(b), // not a set...
        cb_spy = jest.fn(arg => arg),
        merge = $SU.mergeArrays([a, b], cb_spy);

      expect(merge).not.toEqual(r);
      expect(merge.length).toBe(5);
      expect(cb_spy).toHaveBeenCalled;
      expect(cb_spy).toHaveBeenCalledTimes(6);
    });

    it("should correctly mergeArrays two object arrays given certain IDs", () => {
      let a = [{ id: 1 }, { id: 2 }, { id: 3 }],
        b = [{ id: 3 }, { id: 4 }, { id: 5 }],
        r = a.concat(b),
        cb_spy = jest.fn(arg => arg.id),
        merge = $SU.mergeArrays([a, b], cb_spy);

      expect(merge).not.toEqual(r);
      expect(merge.length).toBe(5);
      expect(cb_spy).toHaveBeenCalled;
      expect(cb_spy).toHaveBeenCalledTimes(6);
    });

    it("should mergeArrays two object arrays by their toString method, if no CB given", () => {
      let a = [{ id: 1 }, { id: 2 }, { id: 3 }],
        b = [{ id: 4 }, { id: 5 }, { id: 6 }],
        r = a.concat(b),
        merge = $SU.mergeArrays([a, b]);

      expect(merge).not.toEqual(r);
      expect(merge.length).toBe(1);
    });
  });

  describe("Merge Array no duplicates tests", () => {
    it("should merge two arrays with only one or no elements", () => {
      let a = [0],
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
    it("should merge two more complex arrays", () => {
      let a = [0, 1, 2, 4, 5, 6, 10, 11],
        b = [0, 2, 4, 5, 7, 9, 10, 11, 12];

      expect($SU.mergeOrderedArraysNoDups(a, b)).toEqual([0, 1, 2, 4, 5, 6, 7, 9, 10, 11, 12]);
      expect($SU.mergeOrderedArraysNoDups(b, b)).toEqual(b);
    });
  });

  describe("Merge Object tests", () => {
    it("should only accept objects as arg inputs", () => {
      let a = {},
        b = [1, 2, 3],
        c = "bla",
        d = 55,
        e = undefined,
        f = new Date();

      expect($SU.mergeObjects.bind($SU, [a, b])).toThrowError("Will only take objects as inputs");
      expect($SU.mergeObjects.bind($SU, [a, c])).toThrowError("Will only take objects as inputs");
      expect($SU.mergeObjects.bind($SU, [a, d])).toThrowError("Will only take objects as inputs");
      expect($SU.mergeObjects.bind($SU, [a, e])).toThrowError("Will only take objects as inputs");
      expect($SU.mergeObjects.bind($SU, [a, f])).toThrowError("Will only take objects as inputs");
    });

    it("should merge two empty objects into an emtpy result object", () => {
      let a = {},
        b = {};

      expect($SU.mergeObjects([a, b])).toEqual({});
    });

    it("should merge two objects with disjoint key sets into an expected result object", () => {
      let a = { 1: "bla", 2: "hoo" },
        b = { 3: "ya", 4: true };

      expect($SU.mergeObjects([a, b])).toEqual({ 1: "bla", 2: "hoo", 3: "ya", 4: true });
    });

    it("should overwrite duplicate keys with those from the latter objects", () => {
      let a = { 1: "bla", 2: "hoo" },
        b = { 2: "ya", 4: true },
        c = { yi: "haa", 4: false };

      expect($SU.mergeObjects([a, b, c])).toEqual({ 1: "bla", 2: "ya", yi: "haa", 4: false });
    });
  });

  describe("Clone Object tests", () => {
    it("should return whatever non-object is passed in", () => {
      expect($SU.clone(undefined)).toBeUndefined();
      expect($SU.clone(true)).toBe(true);
      expect($SU.clone(55)).toBe(55);
      expect($SU.clone("bla")).toBe("bla");
      const date = +new Date();
      expect($SU.clone(date)).toBe(date);
      const arr = [1, 2, 3, [4, 5, 6]];
      // check if all entries are the same
      expect($SU.clone(arr)).toEqual(arr);
      // check that the reference is not the same
      expect($SU.clone(arr)).not.toBe(arr);
    });

    it("should ignore a BaseEdge Instance", () => {
      const a = new BaseNode("A");
      const b = new BaseNode("B");
      const edge = new BaseEdge("edgy", a, b);
      expect($SU.clone(edge)).toBeNull();
    });

    it("should ignore a BaseNode Instance", () => {
      const node = new BaseNode("A");
      expect($SU.clone(node)).toBeNull();
    });

    it("should ignore a BaseGraph Instance", () => {
      const graph = new BaseGraph("emptinius");
      expect($SU.clone(graph)).toBeNull();
    });

    /**
     * @todo necessary ??
     */
    it("should ignore not-own-properties", () => {
      const obj = function () {
        this.bla = "hoo";
      };
      obj.prototype.getBla = function () {
        return this.bla;
      };
      const a = new obj();
      expect(a.getBla).toBeDefined();
      const b = $SU.clone(a);
      expect(b.getBla).toBeUndefined();
    });

    it("should correctly clone an object", () => {
      const obj = { 1: { bla: "hoo" }, 2: true, false: true };
      expect($SU.clone(obj)).toEqual(obj);
    });
  });
});
