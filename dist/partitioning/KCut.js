"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var $SU = require("../utils/structUtils");
var logger_1 = require("../utils/logger");
var logger = new logger_1.Logger();
var KCut = /** @class */ (function () {
    function KCut(_graph) {
        this._graph = _graph;
        this._partitioning = {
            partitions: {},
            nodePartMap: {},
            nodeFrontMap: {},
            cut_cost: 0
        };
    }
    KCut.prototype.cut = function (k, shuffle) {
        if (shuffle === void 0) { shuffle = false; }
        var nodes = this._graph.getNodes(), n = Object.keys(nodes).length, nr_parts = k;
        var nr_rest = n % k;
        var node_ids = Object.keys(this._graph.getNodes());
        shuffle && $SU.shuffleArray(node_ids);
        var node_idx = 0;
        for (var i = 0; i < nr_parts; i++) {
            var part_size = Math.floor(n / k);
            var partition = {
                nodes: {}
            };
            // Adding nodes, either in order or shuffled
            while (part_size--) {
                var node = this._graph.getNodeById(node_ids[node_idx++]);
                partition.nodes[node.getID()] = node;
            }
            // Distributing 'rest' nodes to earliest 'rest' partitions
            if (nr_rest) {
                var node = this._graph.getNodeById(node_ids[node_idx++]);
                partition.nodes[node.getID()] = node;
                nr_rest--;
            }
            this._partitioning.partitions[i] = partition;
        }
        return this._partitioning;
    };
    return KCut;
}());
exports.default = KCut;
