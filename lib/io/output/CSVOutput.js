"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var CSVOutput = (function () {
    function CSVOutput(config) {
        this._config = config || {
            separator: config && config.separator || ',',
            explicit_direction: config && config.explicit_direction || true,
            direction_mode: config && config.direction_mode || false
        };
    }
    CSVOutput.prototype.writeToAdjacencyListFile = function (filepath, graph) {
        if (typeof window !== 'undefined' && window !== null) {
            throw new Error('cannot write to File inside of Browser');
        }
        fs.writeFileSync(filepath, this.writeToAdjacencyList(graph));
    };
    CSVOutput.prototype.writeToAdjacencyList = function (graph) {
        var graphString = "";
        var nodes = graph.getNodes(), node = null, adj_nodes = null, adj_node = null;
        for (var node_key in nodes) {
            node = nodes[node_key];
            graphString += node.getID();
            adj_nodes = node.reachNodes(this.mergeFunc);
            for (var adj_idx in adj_nodes) {
                adj_node = adj_nodes[adj_idx].node;
                graphString += this._config.separator + adj_node.getID();
            }
            graphString += "\n";
        }
        return graphString;
    };
    CSVOutput.prototype.writeToEdgeListFile = function (filepath, graph, weighted) {
        if (weighted === void 0) { weighted = false; }
        if (typeof window !== 'undefined' && window !== null) {
            throw new Error('cannot write to File inside of Browser');
        }
        fs.writeFileSync(filepath, this.writeToEdgeList(graph, weighted));
    };
    CSVOutput.prototype.writeToEdgeList = function (graph, weighted) {
        if (weighted === void 0) { weighted = false; }
        var graphString = "", nodes = graph.getNodes(), node = null, adj_nodes = null, adj_entry, adj_node = null, weight_str;
        for (var node_key in nodes) {
            node = nodes[node_key];
            adj_nodes = node.reachNodes(this.mergeFunc);
            for (var adj_idx in adj_nodes) {
                adj_entry = adj_nodes[adj_idx];
                adj_node = adj_entry.node;
                weight_str = '';
                if (weighted) {
                    weight_str = this._config.separator;
                    weight_str += adj_entry.edge.isWeighted() ? adj_entry.edge.getWeight() : 1;
                }
                graphString += node.getID() + this._config.separator + adj_node.getID() + weight_str + '\n';
            }
        }
        return graphString;
    };
    CSVOutput.prototype.mergeFunc = function (ne) {
        return ne.node.getID();
    };
    return CSVOutput;
}());
exports.CSVOutput = CSVOutput;
