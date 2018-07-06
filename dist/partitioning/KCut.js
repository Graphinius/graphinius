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
        for (var i = 0; i < nr_parts; i++) {
            var part_size = Math.floor(n / k);
            var partition = {
                nodes: new Map()
            };
            // Adding nodes, either in order or shuffled
            while (part_size--) {
                var node = this._graph.getNodeById(node_ids[node_idx++]);
                partition.nodes.set(node.getID(), node);
            }
            // Distributing 'rest' nodes to earliest 'rest' partitions
            if (nr_rest) {
                var node = this._graph.getNodeById(node_ids[node_idx++]);
                partition.nodes.set(node.getID(), node);
                nr_rest--;
            }
            this._partitioning.partitions.set(i, partition);
        }
        return this._partitioning;
    };
    return KCut;
}());
exports.default = KCut;
