"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const $SU = require("../utils/StructUtils");
class KCut {
    constructor(_graph) {
        this._graph = _graph;
        this._partitioning = {
            partitions: new Map(),
            nodePartMap: new Map(),
            cut_cost: 0
        };
    }
    cut(k, shuffle = false) {
        const nodes = this._graph.getNodes(), keys = Object.keys(nodes), n = keys.length, nr_parts = k;
        let nr_rest = n % k;
        let node_ids = Object.keys(this._graph.getNodes());
        shuffle && $SU.shuffleArray(node_ids);
        let node_idx = 0;
        let nodePartMap = new Map();
        for (let i = 1; i <= nr_parts; i++) {
            let part_size = Math.floor(n / k);
            let partition = {
                nodes: new Map()
            };
            while (part_size--) {
                let node = this._graph.getNodeById(node_ids[node_idx++]);
                partition.nodes.set(node.getID(), node);
                nodePartMap.set(node.getID(), i);
            }
            if (nr_rest) {
                let node = this._graph.getNodeById(node_ids[node_idx++]);
                partition.nodes.set(node.getID(), node);
                nodePartMap.set(node.getID(), i);
                nr_rest--;
            }
            this._partitioning.partitions.set(i, partition);
        }
        this._partitioning.nodePartMap = nodePartMap;
        return this._partitioning;
    }
}
exports.KCut = KCut;
