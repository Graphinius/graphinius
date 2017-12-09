"use strict";
(function (BinaryHeapMode) {
    BinaryHeapMode[BinaryHeapMode["MIN"] = 0] = "MIN";
    BinaryHeapMode[BinaryHeapMode["MAX"] = 1] = "MAX";
})(exports.BinaryHeapMode || (exports.BinaryHeapMode = {}));
var BinaryHeapMode = exports.BinaryHeapMode;
var BinaryHeap = (function () {
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
        this._positions = {};
    }
    BinaryHeap.prototype.getMode = function () {
        return this._mode;
    };
    BinaryHeap.prototype.getArray = function () {
        return this._array;
    };
    BinaryHeap.prototype.getPositions = function () {
        return this._positions;
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
    BinaryHeap.prototype.peek = function () {
        return this._array[0];
    };
    BinaryHeap.prototype.pop = function () {
        if (this.size()) {
            return this.remove(this._array[0]);
        }
    };
    BinaryHeap.prototype.find = function (obj) {
        var pos = this.getNodePosition(obj);
        return this._array[pos];
    };
    BinaryHeap.prototype.insert = function (obj) {
        if (isNaN(this._evalPriority(obj))) {
            throw new Error("Cannot insert object without numeric priority.");
        }
        this._array.push(obj);
        this.setNodePosition(obj, this.size() - 1, false);
        this.trickleUp(this.size() - 1);
    };
    BinaryHeap.prototype.remove = function (obj) {
        if (isNaN(this._evalPriority(obj))) {
            throw new Error('Object invalid.');
        }
        var objID = this._evalObjID(obj), found = undefined;
        for (var pos = 0; pos < this._array.length; pos++) {
            if (this._evalObjID(this._array[pos]) === objID) {
                found = this._array[pos];
                var last = this._array.pop();
                if (this.size()) {
                    this._array[pos] = last;
                    this.trickleUp(pos);
                    this.trickleDown(pos);
                }
                return found;
            }
        }
        return found;
    };
    BinaryHeap.prototype.trickleDown = function (i) {
        var parent = this._array[i];
        while (true) {
            var right_child_idx = (i + 1) * 2, left_child_idx = right_child_idx - 1, right_child = this._array[right_child_idx], left_child = this._array[left_child_idx], swap = null;
            if (left_child_idx < this.size() && !this.orderCorrect(parent, left_child)) {
                swap = left_child_idx;
            }
            if (right_child_idx < this.size() && !this.orderCorrect(parent, right_child)
                && !this.orderCorrect(left_child, right_child)) {
                swap = right_child_idx;
            }
            if (swap === null) {
                break;
            }
            this._array[i] = this._array[swap];
            this._array[swap] = parent;
            this.setNodePosition(this._array[i], i, true, swap);
            this.setNodePosition(this._array[swap], swap, true, i);
            i = swap;
        }
    };
    BinaryHeap.prototype.trickleUp = function (i) {
        var child = this._array[i];
        while (i) {
            var parent_idx = Math.floor((i + 1) / 2) - 1, parent = this._array[parent_idx];
            if (this.orderCorrect(parent, child)) {
                break;
            }
            else {
                this._array[parent_idx] = child;
                this._array[i] = parent;
                this.setNodePosition(child, parent_idx, true, i);
                this.setNodePosition(parent, i, true, parent_idx);
                i = parent_idx;
            }
        }
    };
    BinaryHeap.prototype.orderCorrect = function (obj_a, obj_b) {
        var obj_a_pr = this._evalPriority(obj_a);
        var obj_b_pr = this._evalPriority(obj_b);
        if (this._mode === BinaryHeapMode.MIN) {
            return obj_a_pr <= obj_b_pr;
        }
        else {
            return obj_a_pr >= obj_b_pr;
        }
    };
    BinaryHeap.prototype.setNodePosition = function (obj, new_pos, replace, old_pos) {
        if (replace === void 0) { replace = true; }
        if (typeof obj === 'undefined' || obj === null || typeof new_pos === 'undefined' || new_pos === null) {
            throw new Error('minium required arguments are ojb and new_pos');
        }
        if (replace === true && (typeof old_pos === 'undefined' || old_pos === null)) {
            throw new Error('replacing a node position requires an old_pos');
        }
        var pos_obj = {
            priority: this.evalInputPriority(obj),
            position: new_pos
        };
        var obj_key = this.evalInputObjID(obj);
        var occurrence = this._positions[obj_key];
        if (!occurrence) {
            this._positions[obj_key] = pos_obj;
        }
        else if (Array.isArray(occurrence)) {
            if (replace) {
                for (var i = 0; i < occurrence.length; i++) {
                    if (occurrence[i].position === old_pos) {
                        occurrence[i].position = new_pos;
                        return;
                    }
                }
            }
            else {
                occurrence.push(pos_obj);
            }
        }
        else {
            if (replace) {
                this._positions[obj_key] = pos_obj;
            }
            else {
                this._positions[obj_key] = [occurrence, pos_obj];
            }
        }
    };
    BinaryHeap.prototype.getNodePosition = function (obj) {
        var obj_key = this.evalInputObjID(obj);
        var occurrence = this._positions[obj_key];
        if (!occurrence) {
            console.log("getNodePosition: no occurrence found");
            console.log("Neighborhood entry: ");
            console.dir(obj);
            console.log("Object KEY: " + obj_key);
            return undefined;
        }
        else if (Array.isArray(occurrence)) {
            var node = null, min = Number.POSITIVE_INFINITY;
            for (var i = 0; i < occurrence.length; i++) {
                if (occurrence[i].position < min) {
                    node = occurrence[i];
                }
            }
            if (node) {
                if (typeof node.position === 'undefined')
                    console.log('Node position: undefined!');
                return node.position;
            }
        }
        else {
            if (typeof occurrence.position === 'undefined')
                console.log('Occurrence position: undefined!');
            return occurrence.position;
        }
    };
    BinaryHeap.prototype.unsetNodePosition = function (obj) {
        var obj_key = this.evalInputObjID(obj);
        var occurrence = this._positions[obj_key];
        if (!occurrence) {
            console.log("Neighborhood entry: ");
            console.log("Object: ");
            console.dir(obj);
            console.log("Object KEY: " + obj_key);
            return undefined;
        }
        else if (Array.isArray(occurrence)) {
            var node_idx = null, node = null, min = Number.POSITIVE_INFINITY;
            for (var i = 0; i < occurrence.length; i++) {
                if (occurrence[i].position < min) {
                    node_idx = i;
                    node = occurrence[i];
                }
            }
            if (node) {
                occurrence.splice(node_idx, 1);
                if (occurrence.length === 1) {
                    this._positions[obj_key] = occurrence[0];
                }
                if (typeof node.position === 'undefined')
                    console.log('Node position: undefined!');
                return node.position;
            }
        }
        else {
            delete this._positions[obj_key];
            return occurrence.position;
        }
    };
    return BinaryHeap;
}());
exports.BinaryHeap = BinaryHeap;
