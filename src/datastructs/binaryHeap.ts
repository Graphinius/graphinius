/// <reference path="../../typings/tsd.d.ts" />


export enum BinaryHeapMode {
  MIN,
  MAX
}


export interface IBinaryHeap {
  getMode()               : BinaryHeapMode;
  getEvalKeyFun()         : Function;
  evalInputKey(obj: any)  : number;
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
}


export { BinaryHeap };