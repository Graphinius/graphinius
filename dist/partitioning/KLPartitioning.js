"use strict";
var __values = (this && this.__values) || function (o) {
    var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
    if (m) return m.call(o);
    return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
};
Object.defineProperty(exports, "__esModule", { value: true });
var binaryHeap_1 = require("../datastructs/binaryHeap");
var logger_1 = require("../utils/logger");
var logger = new logger_1.Logger();
var DEFAULT_WEIGHT = 1;
var KLPartitioning = /** @class */ (function () {
    // public _open: {[key:string]: boolean}
    function KLPartitioning(_graph, initShuffle) {
        if (initShuffle === void 0) { initShuffle = false; }
        this._graph = _graph;
        this._partitioning = {
            partitions: new Map(),
            nodePartMap: new Map(),
            cut_cost: 0
        };
        this._costs = {
            internal: {},
            external: {},
        };
        this._adjList = this._graph.adjListDict();
        this._keys = Object.keys(this._graph.getNodes());
        this.initPartitioning(initShuffle);
        if (this._partitioning.partitions.size > 2) {
            throw new Error("KL partitioning works on 2 initial partitions only.");
        }
        this.initCosts();
        this.initGainsHeap();
    }
    KLPartitioning.prototype.initPartitioning = function (initShuffle) {
        var e_1, _a;
        try {
            for (var _b = __values(this._keys), _c = _b.next(); !_c.done; _c = _b.next()) {
                var key = _c.value;
                // this._open[key] = true;
                var node = this._graph.getNodeById(key);
                if (!initShuffle) {
                    // assume we have a node feature 'partition'
                    var node_part = node.getFeature('partition');
                    if (node_part == null) {
                        throw new Error('no node feature "partition" encountered - you need to set initShuffle to true');
                    }
                    else {
                        this._partitioning.nodePartMap.set(key, node_part);
                        if (!this._partitioning.partitions.get(node_part)) {
                            this._partitioning.partitions.set(node_part, {
                                nodes: new Map()
                            });
                        }
                        this._partitioning.partitions.get(node_part).nodes.set(key, node);
                    }
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
    };
    KLPartitioning.prototype.initCosts = function () {
        var _this = this;
        var e_2, _a;
        var _loop_1 = function (key) {
            var nodePartMap = this_1._partitioning.nodePartMap;
            logger.write(key + ' : ');
            /**
             * @todo introduce weighted mode
             */
            Object.keys(this_1._adjList[key]).forEach(function (target) {
                logger.write(target);
                logger.write("[" + nodePartMap.get(key) + ", " + nodePartMap.get(target) + "]");
                if (nodePartMap.get(key) === nodePartMap.get(target)) {
                    logger.write('\u2713' + ' ');
                    if (_this._costs.internal[key]) {
                        _this._costs.internal[key] += DEFAULT_WEIGHT;
                    }
                    else {
                        _this._costs.internal[key] = DEFAULT_WEIGHT;
                    }
                }
                else {
                    logger.write('\u2717' + ' ');
                    if (_this._costs.external[key]) {
                        _this._costs.external[key] += DEFAULT_WEIGHT;
                    }
                    else {
                        _this._costs.external[key] = DEFAULT_WEIGHT;
                    }
                    _this._partitioning.cut_cost += DEFAULT_WEIGHT;
                }
            });
            logger.log('');
        };
        var this_1 = this;
        try {
            for (var _b = __values(Object.keys(this._graph.getNodes())), _c = _b.next(); !_c.done; _c = _b.next()) {
                var key = _c.value;
                _loop_1(key);
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_2) throw e_2.error; }
        }
        // we counted every edge twice in the nested loop above...
        this._partitioning.cut_cost /= 2;
    };
    KLPartitioning.prototype.initGainsHeap = function () {
        var evalID = function (obj) { return obj.id; };
        var evalPriority = function (obj) { return obj.gain; };
        this._gainsHeap = new binaryHeap_1.BinaryHeap(binaryHeap_1.BinaryHeapMode.MIN, evalID, evalPriority);
        this._keys.forEach(function (source) {
        });
    };
    KLPartitioning.prototype.updateCosts = function () {
    };
    KLPartitioning.prototype.doSwapAnd = function () {
    };
    return KLPartitioning;
}());
exports.KLPartitioning = KLPartitioning;
