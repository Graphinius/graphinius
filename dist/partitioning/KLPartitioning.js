"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var logger_1 = require("../utils/logger");
var logger = new logger_1.Logger();
var KLPartitioning = /** @class */ (function () {
    // private _diffCosts : {[key:string]: number};
    function KLPartitioning(_graph, initShuffle) {
        if (initShuffle === void 0) { initShuffle = false; }
        this._graph = _graph;
        this._partitioning = {
            partitions: {},
            nodePartMap: {},
            nodeFrontMap: {},
            cut_cost: 0
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
            // Initialize the node costs
        }
    }
    return KLPartitioning;
}());
exports.KLPartitioning = KLPartitioning;
