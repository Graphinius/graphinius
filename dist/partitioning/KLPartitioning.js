"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var logger_1 = require("../utils/logger");
var logger = new logger_1.Logger();
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
            gain: {},
            maxGain: { source: null, target: null, gain: 0 }
        };
        for (var _i = 0, _a = Object.keys(this._graph.getNodes()); _i < _a.length; _i++) {
            var key = _a[_i];
            var node = this._graph.getNodeById(key);
            // Initialize the partitioning
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
            if (Object.keys(this._partitioning.partitions).length > 2) {
                throw new Error("KL partitioning works on 2 initial partitions only.");
            }
            /**
             * Initialize the node costs
             *
             * @todo shall we introduce "in-partition-edges" & "cross-partition-edges"?
             */
        }
    }
    return KLPartitioning;
}());
exports.KLPartitioning = KLPartitioning;
