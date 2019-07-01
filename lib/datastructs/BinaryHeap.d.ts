export declare enum BinaryHeapMode {
    MIN = 0,
    MAX = 1
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
declare class BinaryHeap implements IBinaryHeap {
    private _mode;
    private _evalPriority;
    private _evalObjID;
    _nr_removes: number;
    private _array;
    private _positions;
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
    insert(obj: any): void;
    remove(obj: any): any;
    private trickleDown;
    private trickleUp;
    private orderCorrect;
    private setNodePosition;
    private getNodePosition;
    private removeNodePosition;
}
export { BinaryHeap };
