/// <reference path="../../typings/tsd.d.ts" />
export declare enum BinaryHeapMode {
    MIN = 0,
    MAX = 1,
}
export interface PositionHeapEntry {
    priority: number;
    position: number;
}
export interface IBinaryHeap {
    getMode(): BinaryHeapMode;
    getArray(): Array<any>;
    size(): number;
    getEvalPriorityFun(): Function;
    evalInputPriority(obj: any): number;
    getEvalObjIDFun(): Function;
    evalInputObjID(obj: any): any;
    insert(obj: any): void;
    remove(obj: any): any;
    peek(): any;
    pop(): any;
    find(obj: any): any;
    getPositions(): any;
}
declare class BinaryHeap implements IBinaryHeap {
    private _mode;
    private _evalPriority;
    private _evalObjID;
    private _array;
    private _positions;
    /**
     * Mode of a min heap should only be set upon
     * instantiation and never again afterwards...
     * @param _mode MIN or MAX heap
     * @param _evalPriority the evaluation function applied to
     * all incoming objects to determine it's score
     * @param _evalObjID function to determine the identity of
     * the object we are looking for at removal etc..
     */
    constructor(_mode?: BinaryHeapMode, _evalPriority?: (obj: any) => number, _evalObjID?: (obj: any) => any);
    getMode(): BinaryHeapMode;
    getArray(): Array<any>;
    getPositions(): {
        [id: string]: PositionHeapEntry;
    } | {
        [id: string]: PositionHeapEntry[];
    };
    size(): number;
    getEvalPriorityFun(): Function;
    evalInputPriority(obj: any): number;
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
    /**
     *
     */
    remove(obj: any): any;
    private trickleDown(i);
    private trickleUp(i);
    private orderCorrect(obj_a, obj_b);
    /**
     * Superstructure to enable search in BinHeap in O(1)
     * @param obj
     * @param pos
     */
    private setNodePosition(obj, new_pos, replace?, old_pos?);
    /**
     *
     */
    private getNodePosition(obj);
    /**
     * @param obj
     * @returns {number}
     */
    private unsetNodePosition(obj);
}
export { BinaryHeap };
