"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
class CSVOutput {
    constructor(_separator = ',', _explicit_direction = true, _direction_mode = false) {
        this._separator = _separator;
        this._explicit_direction = _explicit_direction;
        this._direction_mode = _direction_mode;
    }
    writeToAdjacencyListFile(filepath, graph) {
        if (typeof window !== 'undefined' && window !== null) {
            throw new Error('cannot write to File inside of Browser');
        }
        fs.writeFileSync(filepath, this.writeToAdjacencyList(graph));
    }
    writeToAdjacencyList(graph) {
        let graphString = "";
        let nodes = graph.getNodes(), node = null, adj_nodes = null, adj_node = null;
        for (let node_key in nodes) {
            node = nodes[node_key];
            graphString += node.getID();
            adj_nodes = node.reachNodes(this.mergeFunc);
            for (let adj_idx in adj_nodes) {
                adj_node = adj_nodes[adj_idx].node;
                graphString += this._separator + adj_node.getID();
            }
            graphString += "\n";
        }
        return graphString;
    }
    writeToEdgeListFile(filepath, graph, weighted = false) {
        if (typeof window !== 'undefined' && window !== null) {
            throw new Error('cannot write to File inside of Browser');
        }
        fs.writeFileSync(filepath, this.writeToEdgeList(graph, weighted));
    }
    writeToEdgeList(graph, weighted = false) {
        let graphString = "", nodes = graph.getNodes(), node = null, adj_nodes = null, adj_entry, adj_node = null, weight_str;
        for (let node_key in nodes) {
            node = nodes[node_key];
            adj_nodes = node.reachNodes(this.mergeFunc);
            for (let adj_idx in adj_nodes) {
                adj_entry = adj_nodes[adj_idx];
                adj_node = adj_entry.node;
                weight_str = '';
                if (weighted) {
                    weight_str = this._separator;
                    weight_str += adj_entry.edge.isWeighted() ? adj_entry.edge.getWeight() : 1;
                }
                graphString += node.getID() + this._separator + adj_node.getID() + weight_str + '\n';
            }
        }
        return graphString;
    }
    mergeFunc(ne) {
        return ne.node.getID();
    }
}
exports.CSVOutput = CSVOutput;
