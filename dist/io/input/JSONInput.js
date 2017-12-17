"use strict";
var fs = require('fs');
var $G = require('../../core/Graph');
var $R = require('../../utils/remoteUtils');
var DEFAULT_WEIGHT = 1;
var JSONInput = (function () {
    function JSONInput(_explicit_direction, _direction, _weighted_mode) {
        if (_explicit_direction === void 0) { _explicit_direction = true; }
        if (_direction === void 0) { _direction = false; }
        if (_weighted_mode === void 0) { _weighted_mode = false; }
        this._explicit_direction = _explicit_direction;
        this._direction = _direction;
        this._weighted_mode = _weighted_mode;
    }
    JSONInput.prototype.readFromJSONFile = function (filepath) {
        this.checkNodeEnvironment();
        var json = JSON.parse(fs.readFileSync(filepath).toString());
        return this.readFromJSON(json);
    };
    JSONInput.prototype.readFromJSONURL = function (fileurl, cb) {
        var self = this, graph, request, json;
        if (typeof window !== 'undefined') {
            request = new XMLHttpRequest();
            request.onreadystatechange = function () {
                if (request.readyState == 4 && request.status == 200) {
                    var json = JSON.parse(request.responseText);
                    graph = self.readFromJSON(json);
                    if (cb) {
                        cb(graph, undefined);
                    }
                }
            };
            request.open("GET", fileurl, true);
            request.timeout = 60000;
            request.setRequestHeader('Content-Type', 'application/json');
            request.send();
        }
        else {
            $R.retrieveRemoteFile(fileurl, function (raw_graph) {
                graph = self.readFromJSON(JSON.parse(raw_graph));
                cb(graph, undefined);
            });
        }
    };
    JSONInput.prototype.readFromJSON = function (json) {
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
            for (var e in edges) {
                var edge_input = edges[e], target_node_id = edge_input.to, directed = this._explicit_direction ? edge_input.directed : this._direction, dir_char = directed ? 'd' : 'u', weight_float = this.handleEdgeWeights(edge_input), weight_info = weight_float === weight_float ? weight_float : DEFAULT_WEIGHT, edge_weight = this._weighted_mode ? weight_info : undefined, target_node = graph.hasNodeID(target_node_id) ? graph.getNodeById(target_node_id) : graph.addNodeByID(target_node_id);
                var edge_id = node_id + "_" + target_node_id + "_" + dir_char, edge_id_u2 = target_node_id + "_" + node_id + "_" + dir_char;
                if (graph.hasEdgeID(edge_id)) {
                    continue;
                }
                if ((!directed && graph.hasEdgeID(edge_id_u2))) {
                    if (this._weighted_mode) {
                        var edge_1 = graph.getEdgeById(edge_id_u2);
                        if (edge_weight != edge_1.getWeight()) {
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
    };
    JSONInput.prototype.handleEdgeWeights = function (edge_input) {
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
    };
    JSONInput.prototype.checkNodeEnvironment = function () {
        if (typeof window !== 'undefined') {
            throw new Error('Cannot read file in browser environment.');
        }
    };
    return JSONInput;
}());
exports.JSONInput = JSONInput;
