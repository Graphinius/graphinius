"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const fs = require("fs");
const $G = require("../../core/Graph");
const $R = require("../../utils/RemoteUtils");
const Logger_1 = require("../../utils/Logger");
let logger = new Logger_1.Logger();
const DEFAULT_WEIGHT = 1;
const CSV_EXTENSION = ".csv";
class CSVInput {
    constructor(config) {
        this._config = config || {
            separator: config && config.separator || ',',
            explicit_direction: config && config.explicit_direction || true,
            direction_mode: config && config.direction_mode || false,
            weighted: config && config.weighted || false
        };
    }
    readFromAdjacencyListURL(config, cb) {
        this.readGraphFromURL(config, cb, this.readFromAdjacencyList);
    }
    readFromEdgeListURL(config, cb) {
        this.readGraphFromURL(config, cb, this.readFromEdgeList);
    }
    readGraphFromURL(config, cb, localFun) {
        var self = this, graph_name = config.file_name, graph, request;
        $R.checkNodeEnvironment();
        $R.retrieveRemoteFile(config, function (raw_graph) {
            var input = raw_graph.toString().split('\n');
            graph = localFun.apply(self, [input, graph_name]);
            cb(graph, undefined);
        });
    }
    readFromAdjacencyListFile(filepath) {
        return this.readFileAndReturn(filepath, this.readFromAdjacencyList);
    }
    readFromEdgeListFile(filepath) {
        return this.readFileAndReturn(filepath, this.readFromEdgeList);
    }
    readFileAndReturn(filepath, func) {
        $R.checkNodeEnvironment();
        var graph_name = path.basename(filepath);
        var input = fs.readFileSync(filepath).toString().split('\n');
        return func.apply(this, [input, graph_name]);
    }
    readFromAdjacencyList(input, graph_name) {
        var graph = new $G.BaseGraph(graph_name);
        for (var idx in input) {
            var line = input[idx], elements = this._config.separator.match(/\s+/g) ? line.match(/\S+/g) : line.replace(/\s+/g, '').split(this._config.separator), node_id = elements[0], node, edge_array = elements.slice(1), edge, target_node_id, target_node, dir_char, directed, edge_id, edge_id_u2;
            if (!node_id) {
                continue;
            }
            node = graph.hasNodeID(node_id) ? graph.getNodeById(node_id) : graph.addNodeByID(node_id);
            for (var e = 0; e < edge_array.length;) {
                if (this._config.explicit_direction && (!edge_array || edge_array.length % 2)) {
                    throw new Error('Every edge entry has to contain its direction info in explicit mode.');
                }
                target_node_id = edge_array[e++];
                target_node = graph.hasNodeID(target_node_id) ? graph.getNodeById(target_node_id) : graph.addNodeByID(target_node_id);
                dir_char = this._config.explicit_direction ? edge_array[e++] : this._config.direction_mode ? 'd' : 'u';
                if (dir_char !== 'd' && dir_char !== 'u') {
                    throw new Error("Specification of edge direction invalid (d and u are valid).");
                }
                directed = dir_char === 'd';
                edge_id = node_id + "_" + target_node_id + "_" + dir_char;
                edge_id_u2 = target_node_id + "_" + node_id + "_" + dir_char;
                if (graph.hasEdgeID(edge_id) || (!directed && graph.hasEdgeID(edge_id_u2))) {
                    continue;
                }
                else {
                    edge = graph.addEdgeByID(edge_id, node, target_node, { directed: directed });
                }
            }
        }
        return graph;
    }
    readFromEdgeList(input, graph_name, weighted = false) {
        var graph = new $G.BaseGraph(graph_name);
        for (var idx in input) {
            var line = input[idx], elements = this._config.separator.match(/\s+/g) ? line.match(/\S+/g) : line.replace(/\s+/g, '').split(this._config.separator);
            if (!elements) {
                continue;
            }
            if (elements.length < 2 || elements.length > 3) {
                logger.log(elements);
                throw new Error('Edge list is in wrong format - every line has to consist of two entries (the 2 nodes)');
            }
            var node_id = elements[0], node, target_node, edge, target_node_id = elements[1], dir_char = this._config.explicit_direction ? elements[2] : this._config.direction_mode ? 'd' : 'u', directed, edge_id, edge_id_u2, parse_weight, edge_weight;
            node = graph.hasNodeID(node_id) ? graph.getNodeById(node_id) : graph.addNodeByID(node_id);
            target_node = graph.hasNodeID(target_node_id) ? graph.getNodeById(target_node_id) : graph.addNodeByID(target_node_id);
            if (dir_char !== 'd' && dir_char !== 'u') {
                throw new Error("Specification of edge direction invalid (d and u are valid).");
            }
            directed = dir_char === 'd';
            edge_id = node_id + "_" + target_node_id + "_" + dir_char;
            edge_id_u2 = target_node_id + "_" + node_id + "_" + dir_char;
            parse_weight = parseFloat(elements[2]);
            edge_weight = this._config.weighted ? (isNaN(parse_weight) ? DEFAULT_WEIGHT : parse_weight) : null;
            if (graph.hasEdgeID(edge_id) || (!directed && graph.hasEdgeID(edge_id_u2))) {
                continue;
            }
            else if (this._config.weighted) {
                edge = graph.addEdgeByID(edge_id, node, target_node, { directed: directed, weighted: true, weight: edge_weight });
            }
            else {
                edge = graph.addEdgeByID(edge_id, node, target_node, { directed: directed });
            }
        }
        return graph;
    }
}
exports.CSVInput = CSVInput;
