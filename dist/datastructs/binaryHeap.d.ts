/// <reference path="../../typings/tsd.d.ts" />
export declare enum BinaryHeapMode {
    MIN = 0,
    MAX = 1,
}
export interface PositionHeapEntry {
    score: number;
    position: number;
}
export interface IBinaryHeap {
    getMode(): BinaryHeapMode;
    getArray(): Array<any>;
    size(): number;
    getEvalPriorityFun(): Function;
    evalInputScore(obj: any): number;
    getEvalObjIDFun(): Function;
    evalInputObjID(obj: any): any;
    insert(obj: any): void;
    remove(obj: any): any;
    peek(): any;
    pop(): any;
    find(obj: any): any;
    getPositions(): any;
}
/**
 * We only support unique object ID's for now !!!
 * @TODO Rename into "ObjectBinaryHeap" or such...
 */
declare class BinaryHeap implements IBinaryHeap {
    private _mode;
    private _evalPriority;
    private _evalObjID;
    _nr_removes: number;
    private _array;
    private _positions;
    /**
     * Mode of a min heap should only be set upon
     * instantiation and never again afterwards...
     * @param _mode MIN or MAX heap
     * @param _evalObjID function to determine an object's identity
     * @param _evalPriority function to determine an objects score
     */
    constructor(_mode?: BinaryHeapMode, _evalPriority?: (obj: any) => number, _evalObjID?: (obj: any) => any);
    getMode(): BinaryHeapMode;
    getArray(): Array<any>;
    getPositions(): {
        [id: string]: PositionHeapEntry;
    };
    size(): number;
    getEvalPriorityFun(): Function;
    evalInputScore(obj: any): number;
    getEvalObjIDFun(): Function;
    evalInputObjID(obj: any): any;
    peek(): any;
    pop(): any;
    find(obj: any): any;
    /**
     * Insert - Adding an object to the heap
     * @param obj the obj to add to the heap
     * @returns {number} the objects index in the internal array
     */
    insert(obj: any): void;
    remove(obj: any): any;
    private trickleDown(i);
    private trickleUp(i);
    private orderCorrect(obj_a, obj_b);
    /**
     * Superstructure to enable search in BinHeap in O(1)
     * @param obj
     * @param pos
     */
    private setNodePosition(obj, pos);
    /**
     *
     */
    private getNodePosition(obj);
    /**
     * @param obj
     * @returns {number}
     */
    private removeNodePosition(obj);
}
export { BinaryHeap };
