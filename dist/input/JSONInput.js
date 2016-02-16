/// <reference path="../../typings/tsd.d.ts" />
var fs = require('fs');
var path = require('path');
var $G = require('../core/Graph');
var DEFAULT_WEIGHT = 1;
var JSONInput = (function () {
    function JSONInput(_explicit_direction, _direction_mode, _weighted_mode) {
        if (_explicit_direction === void 0) { _explicit_direction = true; }
        if (_direction_mode === void 0) { _direction_mode = false; }
        if (_weighted_mode === void 0) { _weighted_mode = false; }
        this._explicit_direction = _explicit_direction;
        this._direction_mode = _direction_mode;
        this._weighted_mode = _weighted_mode;
    }
    JSONInput.prototype.readFromJSONFile = function (filepath) {
        this.checkNodeEnvironment();
        var json = JSON.parse(fs.readFileSync(filepath).toString());
        return this.readFromJSON(json);
    };
    JSONInput.prototype.readFromJSONURL = function (fileurl, cb) {
        var self = this, graph_name = path.basename(fileurl), graph, request, json;
        // Node or browser ??
        if (typeof window !== 'undefined') {
            // Browser...
            request = new XMLHttpRequest();
            request.onreadystatechange = function () {
                if (request.readyState == 4 && request.status == 200) {
                    var json = JSON.parse(request.responseText);
                    graph = self.readFromJSON(json);
                    cb(graph, undefined);
                }
            };
            request.open("GET", fileurl, true);
            request.setRequestHeader('Content-Type', 'text/csv; charset=ISO-8859-1');
            request.send();
        }
        else {
            // Node.js
            request = require('request');
            request({
                url: fileurl,
                json: true
            }, function (err, res, json) {
                if (!err && res.statusCode === 200) {
                    // Deal with the CSV response
                    graph = self.readFromJSON(json);
                    cb(graph, undefined);
                }
            });
        }
    };
    /**
     * In this case, there is one great difference to the CSV edge list cases:
     * If you don't explicitly define a directed edge, it will simply
     * instantiate an undirected one
     * we'll leave that for now, as we will produce apt JSON sources later anyways...
     */
    JSONInput.prototype.readFromJSON = function (json) {
        var graph = new $G.BaseGraph(json.name), coords_json, coords, coord_idx, coord_val, features, feature;
        // feature_val	: any;
        for (var node_id in json.data) {
            var node = graph.hasNodeID(node_id) ? graph.getNodeById(node_id) : graph.addNode(node_id);
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
                var edge_input = String(edges[e]).match(/\S+/g), target_node_id = edge_input[0], 
                // Is there any direction information?
                dir_char = this._explicit_direction ? edge_input[1] : this._direction_mode ? 'd' : 'u', directed = dir_char === 'd', 
                // Is there any weight information?,
                weight_float = parseFloat(edge_input[2]), weight_info = weight_float === weight_float ? weight_float : DEFAULT_WEIGHT, edge_weight = this._weighted_mode ? weight_info : undefined, target_node = graph.hasNodeID(target_node_id) ? graph.getNodeById(target_node_id) : graph.addNode(target_node_id);
                var edge_id = node_id + "_" + target_node_id + "_" + dir_char, edge_id_u2 = target_node_id + "_" + node_id + "_" + dir_char;
                if (graph.hasEdgeID(edge_id) || (!directed && graph.hasEdgeID(edge_id_u2))) {
                    // The completely same edge should only be added once...
                    continue;
                }
                else {
                    var edge = graph.addEdge(edge_id, node, target_node, { directed: directed, weighted: this._weighted_mode });
                    if (this._weighted_mode) {
                        edge.setWeight(edge_weight);
                    }
                }
            }
        }
        return graph;
    };
    JSONInput.prototype.checkNodeEnvironment = function () {
        if (!global) {
            throw new Error('Cannot read file in browser environment.');
        }
    };
    return JSONInput;
})();
exports.JSONInput = JSONInput;
