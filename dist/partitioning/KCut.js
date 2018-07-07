"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var $SU = require("../utils/structUtils");
var KCut = /** @class */ (function () {
    function KCut(_graph) {
        this._graph = _graph;
        this._partitioning = {
            partitions: new Map(),
            nodePartMap: new Map(),
            cut_cost: 0
        };
    }
    KCut.prototype.cut = function (k, shuffle) {
        if (shuffle === void 0) { shuffle = false; }
        var nodes = this._graph.getNodes(), keys = Object.keys(nodes), n = keys.length, nr_parts = k;
        var nr_rest = n % k;
        var node_ids = Object.keys(this._graph.getNodes());
        shuffle && $SU.shuffleArray(node_ids);
        var node_idx = 0;
        var nodePartMap = new Map();
        // In maths, partition numbers start with "1"
        for (var i = 1; i <= nr_parts; i++) {
            var part_size = Math.floor(n / k);
            var partition = {
                nodes: new Map()
            };
            // Adding nodes, either in order or shuffled
            while (part_size--) {
                var node = this._graph.getNodeById(node_ids[node_idx++]);
                partition.nodes.set(node.getID(), node);
                nodePartMap.set(node.getID(), i);
            }
            // Distributing 'rest' nodes to earliest 'rest' partitions
            if (nr_rest) {
                var node = this._graph.getNodeById(node_ids[node_idx++]);
                partition.nodes.set(node.getID(), node);
                nodePartMap.set(node.getID(), i);
                nr_rest--;
            }
            this._partitioning.partitions.set(i, partition);
        }
        this._partitioning.nodePartMap = nodePartMap;
        return this._partitioning;
    };
    return KCut;
}());
exports.KCut = KCut;
