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
export { clone, mergeArrays, mergeObjects, findKey };
