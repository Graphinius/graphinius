"use strict";
/// <reference path="../../typings/tsd.d.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
var BinaryHeapMode;
(function (BinaryHeapMode) {
    BinaryHeapMode[BinaryHeapMode["MIN"] = 0] = "MIN";
    BinaryHeapMode[BinaryHeapMode["MAX"] = 1] = "MAX";
})(BinaryHeapMode = exports.BinaryHeapMode || (exports.BinaryHeapMode = {}));
/**
 * We only support unique object ID's for now !!!
 * @TODO Rename into "ObjectBinaryHeap" or such...
 */
class BinaryHeap {
    /**
     * Mode of a min heap should only be set upon
     * instantiation and never again afterwards...
     * @param _mode MIN or MAX heap
     * @param _evalObjID function to determine an object's identity
     * @param _evalPriority function to determine an objects score
     */
    constructor(_mode = BinaryHeapMode.MIN, _evalPriority = (obj) => {
        if (typeof obj !== 'number' && typeof obj !== 'string') {
            return NaN;
        }
        if (typeof obj === 'number') {
            return obj | 0;
        }
        return parseInt(obj);
    }, _evalObjID = (obj) => {
        return obj;
    }) {
        this._mode = _mode;
        this._evalPriority = _evalPriority;
        this._evalObjID = _evalObjID;
        this._nr_removes = 0; // just for debugging
        this._array = [];
        this._positions = {};
    }
    getMode() {
        return this._mode;
    }
    getArray() {
        return this._array;
    }
    getPositions() {
        return this._positions;
    }
    size() {
        return this._array.length;
    }
    getEvalPriorityFun() {
        return this._evalPriority;
    }
    evalInputScore(obj) {
        return this._evalPriority(obj);
    }
    getEvalObjIDFun() {
        return this._evalObjID;
    }
    evalInputObjID(obj) {
        return this._evalObjID(obj);
    }
    peek() {
        return this._array[0];
    }
    pop() {
        if (this.size()) {
            return this.remove(this._array[0]);
        }
    }
    find(obj) {
        var pos = this.getNodePosition(obj);
        return this._array[pos];
    }
    /**
     * Insert - Adding an object to the heap
     * @param obj the obj to add to the heap
     * @returns {number} the objects index in the internal array
     */
    insert(obj) {
        if (isNaN(this._evalPriority(obj))) {
            throw new Error("Cannot insert object without numeric priority.");
        }
        /**
         * @todo if we keep the unique ID stuff, check for it here and throw an Error if needed...
         */
        this._array.push(obj);
        this.setNodePosition(obj, this.size() - 1);
        this.trickleUp(this.size() - 1);
    }
    remove(obj) {
        this._nr_removes++;
        if (isNaN(this._evalPriority(obj))) {
            throw new Error('Object invalid.');
        }
        var objID = this._evalObjID(obj), found = null;
        /**
         * Search in O(1)
         */
        var pos = this.getNodePosition(obj), found = this._array[pos] != null ? this._array[pos] : null;
        /**
         * Search in O(n)
         */
        // for (var pos = 0; pos < this._array.length; ++pos) {
        //   if (this._evalObjID(this._array[pos]) === objID) {
        //     found = this._array[pos];
        //     break;
        //   }
        // }
        if (found === null) {
            return undefined;
        }
        var last_array_obj = this._array.pop();
        this.removeNodePosition(obj);
        if (this.size() && found !== last_array_obj) {
            this._array[pos] = last_array_obj;
            this.setNodePosition(last_array_obj, pos);
            this.trickleUp(pos);
            this.trickleDown(pos);
        }
        return found;
    }
    trickleDown(i) {
        var parent = this._array[i];
        while (true) {
            var right_child_idx = (i + 1) * 2, left_child_idx = right_child_idx - 1, right_child = this._array[right_child_idx], left_child = this._array[left_child_idx], swap = null;
            // check if left child exists && is larger than parent
            if (left_child_idx < this.size() && !this.orderCorrect(parent, left_child)) {
                swap = left_child_idx;
            }
            // check if right child exists && is larger than parent
            if (right_child_idx < this.size() && !this.orderCorrect(parent, right_child)
                && !this.orderCorrect(left_child, right_child)) {
                swap = right_child_idx;
            }
            if (swap === null) {
                break;
            }
            // we only have to swap one child, doesn't matter which one
            this._array[i] = this._array[swap];
            this._array[swap] = parent;
            // console.log(`Trickle down: swapping ${this._array[i]} and ${this._array[swap]}`);
            this.setNodePosition(this._array[i], i);
            this.setNodePosition(this._array[swap], swap);
            i = swap;
        }
    }
    trickleUp(i) {
        var child = this._array[i];
        // Can only trickle up from positive levels
        while (i) {
            var parent_idx = Math.floor((i + 1) / 2) - 1, parent = this._array[parent_idx];
            if (this.orderCorrect(parent, child)) {
                break;
            }
            else {
                this._array[parent_idx] = child;
                this._array[i] = parent;
                // console.log(`Trickle up: swapping ${child} and ${parent}`);
                this.setNodePosition(child, parent_idx);
                this.setNodePosition(parent, i);
                i = parent_idx;
            }
        }
    }
    orderCorrect(obj_a, obj_b) {
        var obj_a_pr = this._evalPriority(obj_a);
        var obj_b_pr = this._evalPriority(obj_b);
        if (this._mode === BinaryHeapMode.MIN) {
            return obj_a_pr <= obj_b_pr;
        }
        else {
            return obj_a_pr >= obj_b_pr;
        }
    }
    /**
     * Superstructure to enable search in BinHeap in O(1)
     * @param obj
     * @param pos
     */
    setNodePosition(obj, pos) {
        if (obj == null || pos == null || pos !== (pos | 0)) {
            throw new Error('minium required arguments are obj and new_pos');
        }
        var pos_obj = {
            score: this.evalInputScore(obj),
            position: pos
        };
        var obj_key = this.evalInputObjID(obj);
        this._positions[obj_key] = pos_obj;
    }
    /**
     *
     */
    getNodePosition(obj) {
        var obj_key = this.evalInputObjID(obj);
        // console.log(obj_key);
        var occurrence = this._positions[obj_key];
        // console.log(occurrence);
        return occurrence ? occurrence.position : null;
    }
    /**
     * @param obj
     * @returns {number}
     */
    removeNodePosition(obj) {
        var obj_key = this.evalInputObjID(obj);
        delete this._positions[obj_key];
    }
}
exports.BinaryHeap = BinaryHeap;
