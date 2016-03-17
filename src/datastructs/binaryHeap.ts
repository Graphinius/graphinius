/// <reference path="../../typings/tsd.d.ts" />


export enum BinaryHeapMode {
  MIN,
  MAX
}


export interface IBinaryHeap {
  getMode()               : BinaryHeapMode;
  getEvalKeyFun()         : Function;
  evalInputKey(obj: any)  : number;
  insert(obj: any)        : number;
}


class BinaryHeap implements IBinaryHeap {

  /**
   * Mode of a min heap should only be set upon
   * instantiation and never again afterwards...
   * @param _mode MIN or MAX heap
   * @param _eval the evaluation function applied to
   * all incoming objects
   */
  constructor( private _mode = BinaryHeapMode.MIN,
               private _eval = (obj) => {
                 if ( typeof obj !== 'number' && typeof obj !== 'string') {
                   return NaN;
                 }
                 return parseInt(obj)
               }
             ) {}

  getMode() : BinaryHeapMode {
    return this._mode;
  }

  getEvalKeyFun(): Function {
    return this._eval;
  }

  evalInputKey(obj: any) : number {
    return this._eval(obj);
  }

  /**
   * Insert - Adding an object to the heap
   * @param obj the obj to add to the heap
   * @returns {number} the objects index in the internal array
   */
  insert(obj: any) : number {
    var position = NaN;

    if ( isNaN( this._eval(obj) ) ) {
      throw new Error("Cannot insert object without numeric priority.")
    }
    
    return position;
  }
}


export { BinaryHeap };