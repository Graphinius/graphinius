/// <reference path="../../typings/tsd.d.ts" />

import * as $N from '../core/Nodes';
import * as $E from '../core/Edges';


/**
 * Method to deep clone an object
 *
 * @param obj
 * @returns {*}
 *
 */
function clone(obj:any): any {
    if (obj === null || typeof obj !== 'object') {
      return obj;
    }

    // check for nodes or edges and ignore them
    if ( obj instanceof $N.BaseNode || obj instanceof $E.BaseEdge ) {
      return;
    }

    var cloneObj = obj.constructor ? obj.constructor() : {};
    for (var attribute in obj) {
      if ( !obj.hasOwnProperty( attribute ) ) {
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
 * @args an Array of any kind of objects
 * @cb callback to return a unique identifier;
 * if this is duplicate, the object will not be stored in result.
 * @returns {Array}
 */
function mergeArrays(args: Array<Array<any>>, cb: Function = undefined ) {
  for ( var arg_idx in args ) {
    if ( !Array.isArray(args[arg_idx]) ) {
      throw new Error('Will only mergeArrays arrays');
    }
  }
  
  var seen = {},
      result = [],
      identity;

  for (var i = 0; i < args.length; i++) {
    for (var j = 0; j < args[i].length; j++) {
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
  for (var i = 0; i < args.length; i++) {
    if ( Object.prototype.toString.call(args[i]) !== '[object Object]' ) {
      throw new Error('Will only take objects as inputs');
    }
  }
  var result = {};
  for (var i = 0; i < args.length; i++) {
    for ( var key in args[i] ) {
      if ( args[i].hasOwnProperty(key) ) {
        result[key] = args[i][key];
      }
    }
  }
  return result;
}


/**
 * @TODO Test !!!
 *
 * @param object
 * @param cb
 */
function findKey( obj: Object, cb: Function ) : string {
  for (var key in obj) {
    if (obj.hasOwnProperty(key) && cb(obj[key])) {
      return key;
    }
  }
  return undefined;
}

/**
 * @TODO Test !!!
 *
 * @param a: first array
 * @param b: second array
 */
function mergeOrderedArraysNoDups(a:Array<number>,b:Array<number>):Array<number>{
  let ret:Array<number> = [];
  let idx_a = 0;
  let idx_b = 0;
  if(a[0]!=null && b[0]!=null){
    while(true){
      if(idx_a >= a.length || idx_b >= b.length)
        break;

      if(a[idx_a] == b[idx_b]){
        if(ret[ret.length-1]!=a[idx_a])
          ret.push(a[idx_a]);
        idx_a++;
        idx_b++;
        continue;
      }
      if(a[idx_a] < b[idx_b]){
        ret.push(a[idx_a]);
        idx_a++;
        continue;
      }
      if(b[idx_b] < a[idx_a]){
        ret.push(b[idx_b]);
        idx_b++;
      }
    }
    if( a[idx_a] > b[idx_b] ) {
      ret.push(b[idx_b]);
      idx_b++;
    }
  }
  while(idx_a < a.length){
    if(a[idx_a]!=null)
      ret.push(a[idx_a]);
    idx_a++;
  }
  while(idx_b < b.length){
    if(b[idx_b]!=null)
      ret.push(b[idx_b]);
    idx_b++;
  }
  //let prev = -1;
  //for(let k in ret ){
  //  if(ret[k]<=prev){
  //    console.log("a:"+  JSON.stringify(a));
  //    console.log("b:"+  JSON.stringify(b));
  //    console.log("ret:"+JSON.stringify(ret));
  //    $Assert(false);
  //  }
  //  prev = ret[k];
  //}
  return ret;
}


export { clone, mergeArrays, mergeOrderedArraysNoDups, mergeObjects, findKey };