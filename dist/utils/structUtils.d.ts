/// <reference path="../../typings/tsd.d.ts" />
/**
 * Method to deep clone an object
 *
 * @param obj
 * @returns {*}
 *
 */
declare function clone(obj: any): any;
/**
 * @args an Array of any kind of objects
 * @cb callback to return a unique identifier;
 * if this is duplicate, the object will not be stored in result.
 * @returns {Array}
 */
declare function mergeArrays(args: Array<Array<any>>, cb?: Function): any[];
/**
 * Overwrites obj1's values with obj2's and adds obj2's if non existent in obj1
 * @param args Array of all the object to take keys from
 * @returns result object
 */
declare function mergeObjects(args: Array<Object>): {};
/**
 * @TODO Test !!!
 *
 * @param object
 * @param cb
 */
declare function findKey(obj: Object, cb: Function): string;
/**
 * Takes two ordered number arrays and merges them. The returned array is
 * also ordered and does not contain any duplicates.
 *
 * @param a: first array
 * @param b: second array
 */
declare function mergeOrderedArraysNoDups(a: Array<number>, b: Array<number>): Array<number>;
export { clone, mergeArrays, mergeOrderedArraysNoDups, mergeObjects, findKey };
