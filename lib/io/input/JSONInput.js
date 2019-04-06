"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const $G = require("../../core/Graph");
const $R = require("../../utils/remoteUtils");
const logger_1 = require("../../utils/logger");
const logger = new logger_1.Logger();
const DEFAULT_WEIGHT = 1;
const JSON_EXTENSION = ".json";
class JSONInput {
    constructor(_explicit_direction = true, _direction = false, _weighted_mode = false) {
        this._explicit_direction = _explicit_direction;
        this._direction = _direction;
        this._weighted_mode = _weighted_mode;
    }
    readFromJSONFile(filepath) {
        $R.checkNodeEnvironment();
        var json = JSON.parse(fs.readFileSync(filepath).toString());
        return this.readFromJSON(json);
    }
    readFromJSONURL(config, cb) {
        var self = this, graph, request, json;
        $R.checkNodeEnvironment();
        $R.retrieveRemoteFile(config, function (raw_graph) {
            graph = self.readFromJSON(JSON.parse(raw_graph));
            cb(graph, undefined);
        });
    }
    readFromJSON(json) {
        var graph = new $G.BaseGraph(json.name), coords_json, coords, coord_idx, coord_val, features, feature;
        for (var node_id in json.data) {
            var node = graph.hasNodeID(node_id) ? graph.getNodeById(node_id) : graph.addNodeByID(node_id);
            if (features = json.data[node_id].features) {
                node.setFeatures(features);
            }
            if (coords_json = json.data[node_id].coords) {
                coords = {};
                for (coord_idx in coords_json) {
                    coords[coord_idx] = +coords_json[coord_idx];
                }
                node.setFeature('coords', coords);
            }
            var edges = json.data[node_id].edges;
            for (let e in edges) {
                let edge_input = edges[e], target_node_id = edge_input.to, directed = this._explicit_direction ? edge_input.directed : this._direction, dir_char = directed ? 'd' : 'u', weight_float = this.handleEdgeWeights(edge_input), weight_info = weight_float === weight_float ? weight_float : DEFAULT_WEIGHT, edge_weight = this._weighted_mode ? weight_info : undefined, target_node = graph.hasNodeID(target_node_id) ? graph.getNodeById(target_node_id) : graph.addNodeByID(target_node_id);
                let edge_id = node_id + "_" + target_node_id + "_" + dir_char, edge_id_u2 = target_node_id + "_" + node_id + "_" + dir_char;
                if (graph.hasEdgeID(edge_id)) {
                    continue;
                }
                if ((!directed && graph.hasEdgeID(edge_id_u2))) {
                    if (this._weighted_mode) {
                        let edge = graph.getEdgeById(edge_id_u2);
                        if (edge_weight != edge.getWeight()) {
                            throw new Error('Input JSON flawed! Found duplicate edge with different weights!');
                        }
                    }
                    continue;
                }
                else {
                    var edge = graph.addEdgeByID(edge_id, node, target_node, {
                        directed: directed,
                        weighted: this._weighted_mode,
                        weight: edge_weight
                    });
                }
            }
        }
        return graph;
    }
    handleEdgeWeights(edge_input) {
        switch (edge_input.weight) {
            case "undefined":
                return DEFAULT_WEIGHT;
            case "Infinity":
                return Number.POSITIVE_INFINITY;
            case "-Infinity":
                return Number.NEGATIVE_INFINITY;
            case "MAX":
                return Number.MAX_VALUE;
            case "MIN":
                return Number.MIN_VALUE;
            default:
                return parseFloat(edge_input.weight);
        }
    }
}
exports.JSONInput = JSONInput;
