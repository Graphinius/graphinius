declare function clone(obj: any): any;
declare function shuffleArray(arr: Array<any>): Array<any>;
declare function mergeArrays(args: Array<Array<any>>, cb?: Function): any[];
declare function mergeObjects(args: Array<Object>): {};
declare function findKey(obj: Object, cb: Function): string;
declare function mergeOrderedArraysNoDups(a: Array<number>, b: Array<number>): Array<number>;
export { clone, shuffleArray, mergeArrays, mergeObjects, mergeOrderedArraysNoDups, findKey };
