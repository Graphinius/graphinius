"use strict";
/// <reference path="../../../typings/tsd.d.ts" />
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
        var graphString = "";
        var nodes = graph.getNodes(), node = null, adj_nodes = null, adj_node = null;
        var mergeFunc = (ne) => {
            return ne.node.getID();
        };
        // TODO make generic for graph mode
        for (var node_key in nodes) {
            node = nodes[node_key];
            graphString += node.getID();
            adj_nodes = node.reachNodes(mergeFunc);
            for (var adj_idx in adj_nodes) {
                adj_node = adj_nodes[adj_idx].node;
                graphString += this._separator + adj_node.getID();
            }
            graphString += "\n";
        }
        return graphString;
    }
    writeToEdgeListFile(filepath, graph) {
        throw new Error("CSVOutput.writeToEdgeListFile not implemented yet.");
    }
    writeToEdgeList(graph) {
        throw new Error("CSVOutput.writeToEdgeList not implemented yet.");
        // var graphString = "";
        // return graphString;
    }
}
exports.CSVOutput = CSVOutput;
