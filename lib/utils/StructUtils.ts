import {BaseGraph} from '@/core/base/BaseGraph'
import {BaseNode} from '@/core/base/BaseNode';
import {BaseEdge} from '@/core/base/BaseEdge';

/**
 * Method to deep clone an object
 *
 * @param obj
 * @returns {*}
 *
 */
function clone(obj: any): any {
	if (obj === null || typeof obj !== 'object') {
		return obj;
	}

	/**
	 * @description for the sake of cloning graph structures, we have specialized
   *              clone methods within the BaseGraph, BaseNode & BaseEdge classes
	 */
	if (obj instanceof BaseGraph || obj instanceof BaseNode || obj instanceof BaseEdge) {
		return null;
	}

	let cloneObj = Array.isArray(obj) ? [] : {};
	for (let attribute in obj) {
		if ( !obj.hasOwnProperty(attribute) ) {
			continue;
		}

		if (typeof obj[attribute] === "object") {
			cloneObj[attribute] = clone(obj[attribute]);
		} else {
			cloneObj[attribute] = obj[attribute];
		}
	}
	return cloneObj;
}


/**
 *
 * @param arr
 *
 * @todo it's obvious, nevertheless needs some testing...
 */
function shuffleArray(arr: Array<any>): Array<any> {
	for (let i = arr.length - 1; i >= 0; i--) {

		let randomIndex = Math.floor(Math.random() * (i + 1));
		let itemAtIndex = arr[randomIndex];

		arr[randomIndex] = arr[i];
		arr[i] = itemAtIndex;
	}
	return arr;
}


/**
 * @args an Array of any kind of objects
 * @cb callback to return a unique identifier;
 * if this is duplicate, the object will not be stored in result.
 * @returns {Array}
 *
 * @todo
 */
function mergeArrays(args: Array<Array<any>>, cb: Function = undefined) {
	for (let arg_idx in args) {
		if (!Array.isArray(args[arg_idx])) {
			throw new Error('Will only mergeArrays arrays');
		}
	}

	let seen = {},
		result = [],
		identity;

	for (let i = 0; i < args.length; i++) {
		for (let j = 0; j < args[i].length; j++) {
			identity = typeof cb !== 'undefined' ? cb(args[i][j]) : args[i][j];

			if (seen[identity] !== true) {
				result.push(args[i][j]);
				seen[identity] = true;
			}
		}
	}
	return result;
}


/**
 * Overwrites obj1's values with obj2's and adds obj2's if non existent in obj1
 * @param args Array of all the object to take keys from
 * @returns result object
 */
function mergeObjects(args: Array<Object>) {
	for (let i = 0; i < args.length; i++) {
		if (Object.prototype.toString.call(args[i]) !== '[object Object]') {
			throw new Error('Will only take objects as inputs');
		}
	}
	let result = {};
	for (let i = 0; i < args.length; i++) {
		for (let key in args[i]) {
			if (args[i].hasOwnProperty(key)) {
				result[key] = args[i][key];
			}
		}
	}
	return result;
}


/**
 * Takes two ordered number arrays and merges them. The returned array is
 * also ordered and does not contain any duplicates.
 *
 * @param a: first array
 * @param b: second array
 */
function mergeOrderedArraysNoDups(a: Array<number>, b: Array<number>): Array<number> {
	let ret: Array<number> = [];
	let idx_a = 0;
	let idx_b = 0;
	if (a[0] != null && b[0] != null) {
		while (true) {
			if (idx_a >= a.length || idx_b >= b.length) {
				break;
			}

			if (a[idx_a] == b[idx_b]) {
				if (ret[ret.length - 1] != a[idx_a]) {
					ret.push(a[idx_a]);
				}
				idx_a++;
				idx_b++;
				continue;
			}
			if (a[idx_a] < b[idx_b]) {
				ret.push(a[idx_a]);
				idx_a++;
				continue;
			}
			if (b[idx_b] < a[idx_a]) {
				ret.push(b[idx_b]);
				idx_b++;
			}
		}
	}
	while (idx_a < a.length) {
		if (a[idx_a] != null) {
			ret.push(a[idx_a]);
		}
		idx_a++;
	}
	while (idx_b < b.length) {
		if (b[idx_b] != null) {
			ret.push(b[idx_b]);
		}
		idx_b++;
	}
	return ret;
}


export {
	clone,
	shuffleArray,
	mergeArrays,
	mergeObjects,
	mergeOrderedArraysNoDups
};