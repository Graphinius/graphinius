"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var logger_1 = require("../utils/logger");
var logger = new logger_1.Logger();
var DEFAULT_WEIGHT = 1;
var KLPartitioning = /** @class */ (function () {
    function KLPartitioning(_graph, initShuffle) {
        if (initShuffle === void 0) { initShuffle = false; }
        this._graph = _graph;
        this._partitioning = {
            partitions: {},
            nodePartMap: {},
            nodeFrontMap: {},
            cut_cost: 0
        };
        this._costs = {
            internal: {},
            external: {},
            // gain: {},
            maxGain: { source: null, target: null, gain: Number.NEGATIVE_INFINITY }
        };
        this._fixed = {};
        this.initPartitioning(initShuffle);
        if (Object.keys(this._partitioning.partitions).length > 2) {
            throw new Error("KL partitioning works on 2 initial partitions only.");
        }
        this.initCosts();
    }
    KLPartitioning.prototype.initPartitioning = function (initShuffle) {
        for (var _i = 0, _a = Object.keys(this._graph.getNodes()); _i < _a.length; _i++) {
            var key = _a[_i];
            var node = this._graph.getNodeById(key);
            if (!initShuffle) {
                // assume we have a node feature 'partition'
                var node_part = node.getFeature('partition');
                if (node_part == null) {
                    throw new Error('no node feature "partition" encountered - you need to set initShuffle to true');
                }
                else {
                    this._partitioning.nodePartMap[key] = node_part;
                    if (!this._partitioning.partitions[node_part]) {
                        this._partitioning.partitions[node_part] = {
                            nodes: {}
                        };
                    }
                    this._partitioning.partitions[node_part].nodes[key] = node;
                }
            }
        }
    };
    KLPartitioning.prototype.initCosts = function () {
        var _this = this;
        var adj_list = this._graph.adjListDict();
        var _loop_1 = function (key) {
            /**
             * Initialize the node costs
             *
             * @todo shall we introduce "in-partition-edges" & "cross-partition-edges"?
             */
            var nodePartMap = this_1._partitioning.nodePartMap;
            logger.write(key + ' : ');
            /**
             * @todo introduce weighted mode
             */
            Object.keys(adj_list[key]).forEach(function (target) {
                logger.write(target);
                logger.write("[" + nodePartMap[key] + ", " + nodePartMap[target] + "]");
                if (nodePartMap[key] === nodePartMap[target]) {
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
        for (var _i = 0, _a = Object.keys(this._graph.getNodes()); _i < _a.length; _i++) {
            var key = _a[_i];
            _loop_1(key);
        }
        // we count every edge twice...
        this._partitioning.cut_cost /= 2;
    };
    KLPartitioning.prototype.calculateIterationGains = function () {
    };
    KLPartitioning.prototype.doIterationSwap = function () {
    };
    return KLPartitioning;
}());
exports.KLPartitioning = KLPartitioning;
