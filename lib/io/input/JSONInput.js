"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var BaseGraph_1 = require("../../core/base/BaseGraph");
var $R = require("../../utils/RemoteUtils");
var interfaces_1 = require("../interfaces");
var Dupes_1 = require("../common/Dupes");
var uuid = require("uuid");
var v4 = uuid.v4;
var Logger_1 = require("../../utils/Logger");
var logger = new Logger_1.Logger();
var DEFAULT_WEIGHT = 1;
var JSONInput = (function () {
    function JSONInput(config) {
        if (config === void 0) { config = {}; }
        this._config = {
            explicit_direction: config.explicit_direction != null ? config.explicit_direction : true,
            directed: config.directed != null ? config.directed : false,
            weighted: config.weighted != null ? config.weighted : false,
            dupeCheck: config.dupeCheck != null ? config.dupeCheck : true
        };
    }
    JSONInput.prototype.readFromJSONFile = function (filepath, graph) {
        $R.checkNodeEnvironment();
        var json = JSON.parse(fs.readFileSync(filepath).toString());
        return this.readFromJSON(json, graph);
    };
    JSONInput.prototype.readFromJSONURL = function (config, cb, graph) {
        var self = this;
        $R.checkNodeEnvironment();
        $R.retrieveRemoteFile(config, function (raw_graph) {
            graph = self.readFromJSON(JSON.parse(raw_graph), graph);
            cb(graph, undefined);
        });
    };
    JSONInput.prototype.readFromJSON = function (json, graph) {
        graph = graph || new BaseGraph_1.BaseGraph(json.name);
        var edc = new Dupes_1.EdgeDupeChecker(graph);
        var rlt = json.typeRLT;
        this.addNodesToGraph(json, graph);
        for (var node_id in json.data) {
            var node = graph.getNodeById(node_id);
            var edges = json.data[node_id][interfaces_1.labelKeys.edges];
            for (var e in edges) {
                var edge_input = edges[e];
                var target_node = this.getTargetNode(graph, edge_input);
                var edge_label = edge_input[interfaces_1.labelKeys.e_label];
                var edge_type = rlt && rlt.edges[edge_input[interfaces_1.labelKeys.e_type]] || null;
                var directed = this._config.explicit_direction ? !!edge_input[interfaces_1.labelKeys.e_dir] : this._config.directed;
                var weight_float = JSONInput.handleEdgeWeights(edge_input);
                var weight_info = weight_float === weight_float ? weight_float : DEFAULT_WEIGHT;
                var edge_weight = this._config.weighted ? weight_info : undefined;
                var target_node_id = edge_input[interfaces_1.labelKeys.e_to];
                var dir_char = directed ? 'd' : 'u';
                var edge_id = node_id + "_" + target_node_id + "_" + dir_char;
                var newEdge = {
                    a: node,
                    b: target_node,
                    label: edge_label,
                    dir: directed,
                    weighted: this._config.weighted,
                    weight: edge_weight,
                    typed: !!edge_type,
                    type: edge_type
                };
                if (this._config.dupeCheck && edc.isDupe(newEdge)) {
                    logger.log("Edge " + edge_id + " is a duplicate according to assumptions... omitting.");
                    continue;
                }
                graph.addEdgeByID(edge_id, node, target_node, {
                    label: edge_label,
                    directed: directed,
                    weighted: this._config.weighted,
                    weight: edge_weight,
                    typed: !!edge_type,
                    type: edge_type
                });
            }
        }
        return graph;
    };
    JSONInput.prototype.addNodesToGraph = function (json, graph) {
        var rlt = json.typeRLT;
        var coords_json, coords, coord_idx, features;
        for (var node_id in json.data) {
            var type = BaseGraph_1.BaseGraph.isTyped(graph) ? rlt && rlt.nodes[json.data[node_id][interfaces_1.labelKeys.n_type]] : null;
            var label = json.data[node_id][interfaces_1.labelKeys.n_label];
            var node = graph.addNodeByID(node_id, { label: label, type: type });
            features = json.data[node_id][interfaces_1.labelKeys.n_features];
            if (features) {
                node.setFeatures(features);
            }
            coords_json = json.data[node_id][interfaces_1.labelKeys.coords];
            if (coords_json) {
                coords = {};
                for (coord_idx in coords_json) {
                    coords[coord_idx] = +coords_json[coord_idx];
                }
                node.setFeature(interfaces_1.labelKeys.coords, coords);
            }
        }
    };
    JSONInput.prototype.getTargetNode = function (graph, edge_input) {
        var target_node_id = edge_input[interfaces_1.labelKeys.e_to];
        var target_node = graph.getNodeById(target_node_id);
        if (!target_node) {
            throw new Error('Node referenced by edge does not exist');
        }
        return target_node;
    };
    JSONInput.handleEdgeWeights = function (edge_input) {
        switch (edge_input[interfaces_1.labelKeys.e_weight]) {
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
                return parseFloat(edge_input[interfaces_1.labelKeys.e_weight]);
        }
    };
    return JSONInput;
}());
exports.JSONInput = JSONInput;
