/// <reference path="../../typings/tsd.d.ts" />
"use strict";
(function (BinaryHeapMode) {
    BinaryHeapMode[BinaryHeapMode["MIN"] = 0] = "MIN";
    BinaryHeapMode[BinaryHeapMode["MAX"] = 1] = "MAX";
})(exports.BinaryHeapMode || (exports.BinaryHeapMode = {}));
var BinaryHeapMode = exports.BinaryHeapMode;
var BinaryHeap = (function () {
    /**
     * Mode of a min heap should only be set upon
     * instantiation and never again afterwards...
     * @param _mode MIN or MAX heap
     * @param _evalPriority the evaluation function applied to
     * all incoming objects to determine it's score
     * @param _evalObjID function to determine the identity of
     * the object we are looking for at removal etc..
     */
    function BinaryHeap(_mode, _evalPriority, _evalObjID) {
        if (_mode === void 0) { _mode = BinaryHeapMode.MIN; }
        if (_evalPriority === void 0) { _evalPriority = function (obj) {
            if (typeof obj !== 'number' && typeof obj !== 'string') {
                return NaN;
            }
            return parseInt(obj);
        }; }
        if (_evalObjID === void 0) { _evalObjID = function (obj) {
            return obj;
        }; }
        this._mode = _mode;
        this._evalPriority = _evalPriority;
        this._evalObjID = _evalObjID;
        this._array = [];
    }
    BinaryHeap.prototype.getMode = function () {
        return this._mode;
    };
    BinaryHeap.prototype.size = function () {
        return this._array.length;
    };
    BinaryHeap.prototype.getEvalPriorityFun = function () {
        return this._evalPriority;
    };
    BinaryHeap.prototype.evalInputPriority = function (obj) {
        return this._evalPriority(obj);
    };
    BinaryHeap.prototype.getEvalObjIDFun = function () {
        return this._evalObjID;
    };
    BinaryHeap.prototype.evalInputObjID = function (obj) {
        return this._evalObjID(obj);
    };
    /**
     * Insert - Adding an object to the heap
     * @param obj the obj to add to the heap
     * @returns {number} the objects index in the internal array
     */
    BinaryHeap.prototype.insert = function (obj) {
        if (isNaN(this._evalPriority(obj))) {
            throw new Error("Cannot insert object without numeric priority.");
        }
        this._array.push(obj);
    };
    BinaryHeap.prototype.remove = function (obj) {
        if (isNaN(this._evalPriority(obj))) {
            throw new Error('Object invalid.');
        }
        var objID = this._evalObjID(obj);
        var found = undefined;
        for (var i = 0; i < this._array.length; i++) {
            if (this._evalObjID(this._array[i]) === objID) {
                found = this._array[i];
                // we pop the last element
                var last = this._array.pop();
                // if the last one was (incidentally) the correct one, we are done
                if (this._array.length - 1 === i) {
                    return found;
                }
                else if (this.size()) {
                    this._array[i] = last;
                    // now trickle...
                    this.trickleUp(i);
                    this.trickleDown(i);
                }
            }
        }
        return found;
    };
    BinaryHeap.prototype.trickleDown = function (i) {
    };
    BinaryHeap.prototype.trickleUp = function (i) {
    };
    /**
     *
     */
    BinaryHeap.prototype.swap = function (obj_a, obj_b) {
    };
    return BinaryHeap;
}());
exports.BinaryHeap = BinaryHeap;
//
// BinaryMinHeap.prototype = {
//   push: function(element) {
//     // Add the new element to the end of the array.
//     this.content.push(element);
//     // Allow it to bubble up.
//     this.bubbleUp(this.content.length - 1);
//   },
//
//   pop: function() {
//     // Store the first element so we can return it later.
//     var result = this.content[0];
//     // Get the element at the end of the array.
//     var end = this.content.pop();
//     // If there are any elements left, put the end element at the
//     // start, and let it sink down.
//     if (this.content.length > 0) {
//       this.content[0] = end;
//       this.sinkDown(0);
//     }
//     return result;
//   },
//
//   remove: function(node) {
//     var length = this.content.length;
//     // To remove a value, we must search through the array to find
//     // it.
//     for (var i = 0; i < length; i++) {
//       if (this.content[i] != node) continue;
//       // When it is found, the process seen in 'pop' is repeated
//       // to fill up the hole.
//       var end = this.content.pop();
//       // If the element we popped was the one we needed to remove,
//       // we're done.
//       if (i == length - 1) break;
//       // Otherwise, we replace the removed element with the popped
//       // one, and allow it to float up or sink down as appropriate.
//       this.content[i] = end;
//       this.bubbleUp(i);
//       this.sinkDown(i);
//       break;
//     }
//   },
//
//   size: function() {
//     return this.content.length;
//   },
//
//   bubbleUp: function(n) {
//     // Fetch the element that has to be moved.
//     var element = this.content[n], score = this.scoreFunction(element);
//     // When at 0, an element can not go up any further.
//     while (n > 0) {
//       // Compute the parent element's index, and fetch it.
//       var parentN = Math.floor((n + 1) / 2) - 1,
//         parent = this.content[parentN];
//       // If the parent has a lesser score, things are in order and we
//       // are done.
//       if (score >= this.scoreFunction(parent))
//         break;
//
//       // Otherwise, swap the parent with the current element and
//       // continue.
//       this.content[parentN] = element;
//       this.content[n] = parent;
//       n = parentN;
//     }
//   },
//
//   sinkDown: function(n) {
//     // Look up the target element and its score.
//     var length = this.content.length,
//       element = this.content[n],
//       elemScore = this.scoreFunction(element);
//
//     while(true) {
//       // Compute the indices of the child elements.
//       var child2N = (n + 1) * 2, child1N = child2N - 1;
//       // This is used to store the new position of the element,
//       // if any.
//       var swap = null;
//       // If the first child exists (is inside the array)...
//       if (child1N < length) {
//         // Look it up and compute its score.
//         var child1 = this.content[child1N],
//           child1Score = this.scoreFunction(child1);
//         // If the score is less than our element's, we need to swap.
//         if (child1Score < elemScore)
//           swap = child1N;
//       }
//       // Do the same checks for the other child.
//       if (child2N < length) {
//         var child2 = this.content[child2N],
//           child2Score = this.scoreFunction(child2);
//         if (child2Score < (swap == null ? elemScore : child1Score))
//           swap = child2N;
//       }
//
//       // No need to swap further, we are done.
//       if (swap == null) break;
//
//       // Otherwise, swap and continue.
//       this.content[n] = this.content[swap];
//       this.content[swap] = element;
//       n = swap;
//     }
//   },
//
//   getMin: function() {
//     return this.content[0];
//   },
