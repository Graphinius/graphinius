"use strict";
/// <reference path="../../../typings/tsd.d.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const $G = require("../../core/Graph");
const $R = require("../../utils/remoteUtils");
const DEFAULT_WEIGHT = 1;
const JSON_EXTENSION = ".json";
class JSONInput {
    constructor(_explicit_direction = true, _direction = false, _weighted_mode = false) {
        this._explicit_direction = _explicit_direction;
        this._direction = _direction;
        this._weighted_mode = _weighted_mode;
    }
    readFromJSONFile(filepath) {
        this.checkNodeEnvironment();
        // TODO test for existing file...
        var json = JSON.parse(fs.readFileSync(filepath).toString());
        return this.readFromJSON(json);
    }
    readFromJSONURL(config, cb) {
        var self = this, graph, request, json;
        // Node or browser ??
        if (typeof window !== 'undefined') {
            // Browser...			
            let fileurl = config.remote_host + config.remote_path + config.file_name + JSON_EXTENSION;
            request = new XMLHttpRequest();
            request.onreadystatechange = function () {
                // console.log("Ready state: " + request.readyState);
                // console.log("Reqst status: " + request.status);
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
            // Node.js
            $R.retrieveRemoteFile(config, function (raw_graph) {
                graph = self.readFromJSON(JSON.parse(raw_graph));
                cb(graph, undefined);
            });
        }
    }
    /**
     * In this case, there is one great difference to the CSV edge list cases:
     * If you don't explicitly define a directed edge, it will simply
     * instantiate an undirected one
     * we'll leave that for now, as we will produce apt JSON sources later anyways...
     */
    readFromJSON(json) {
        var graph = new $G.BaseGraph(json.name), coords_json, coords, coord_idx, coord_val, features, feature;
        for (var node_id in json.data) {
            var node = graph.hasNodeID(node_id) ? graph.getNodeById(node_id) : graph.addNodeByID(node_id);
            /**
             * Reading and instantiating features
             * We are using the shortcut setFeatures here,
             * so we have to read them before any special features
             */
            if (features = json.data[node_id].features) {
                // for ( feature in features ) {
                // 	node.setFeature(feature, features[feature]);
                // }
                node.setFeatures(features);
            }
            /**
             * Reading and instantiating coordinates
             * Coordinates are treated as special features,
             * and are therefore added after general features
             */
            if (coords_json = json.data[node_id].coords) {
                coords = {};
                for (coord_idx in coords_json) {
                    coords[coord_idx] = +coords_json[coord_idx];
                }
                node.setFeature('coords', coords);
            }
            // Reading and instantiating edges
            var edges = json.data[node_id].edges;
            for (var e in edges) {
                var edge_input = edges[e], target_node_id = edge_input.to, 
                // Is there any direction information?            
                directed = this._explicit_direction ? edge_input.directed : this._direction, dir_char = directed ? 'd' : 'u', 
                // Is there any weight information?,
                weight_float = this.handleEdgeWeights(edge_input), weight_info = weight_float === weight_float ? weight_float : DEFAULT_WEIGHT, edge_weight = this._weighted_mode ? weight_info : undefined, target_node = graph.hasNodeID(target_node_id) ? graph.getNodeById(target_node_id) : graph.addNodeByID(target_node_id);
                var edge_id = node_id + "_" + target_node_id + "_" + dir_char, edge_id_u2 = target_node_id + "_" + node_id + "_" + dir_char;
                if (graph.hasEdgeID(edge_id) || (!directed && graph.hasEdgeID(edge_id_u2))) {
                    // The completely same edge should only be added once...
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
    /**
     * Infinity & -Infinity cases are redundant, as JavaScript
     * handles them correctly anyways (for now)
     * @param edge_input
     */
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
    checkNodeEnvironment() {
        if (typeof window !== 'undefined') {
            throw new Error('Cannot read file in browser environment.');
        }
    }
}
exports.JSONInput = JSONInput;
