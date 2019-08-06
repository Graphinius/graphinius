"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const BaseGraph_1 = require("../../core/base/BaseGraph");
const $R = require("../../utils/RemoteUtils");
const interfaces_1 = require("../interfaces");
const uuid = require("uuid");
const v4 = uuid.v4;
const Logger_1 = require("../../utils/Logger");
const logger = new Logger_1.Logger();
const DEFAULT_WEIGHT = 1;
class JSONInput {
    constructor(config) {
        this._config = config || {
            explicit_direction: config && config.explicit_direction || true,
            directed: config && config.directed || false,
            weighted: config && config.weighted || false
        };
    }
    readFromJSONFile(filepath, graph) {
        $R.checkNodeEnvironment();
        let json = JSON.parse(fs.readFileSync(filepath).toString());
        return this.readFromJSON(json, graph);
    }
    readFromJSONURL(config, cb, graph) {
        const self = this;
        $R.checkNodeEnvironment();
        $R.retrieveRemoteFile(config, function (raw_graph) {
            graph = self.readFromJSON(JSON.parse(raw_graph), graph);
            cb(graph, undefined);
        });
    }
    readFromJSON(json, graph) {
        graph = graph || new BaseGraph_1.BaseGraph(json.name);
        const typedGraph = BaseGraph_1.BaseGraph.isTyped(graph);
        let coords_json, coords, coord_idx, features;
        for (let node_id in json.data) {
            const type = typedGraph ? json.data[node_id][interfaces_1.labelKeys.n_type] : null;
            const label = json.data[node_id][interfaces_1.labelKeys.n_label];
            const node = graph.addNodeByID(node_id, { label, type });
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
        for (let node_id in json.data) {
            let node = graph.getNodeById(node_id);
            let edges = json.data[node_id][interfaces_1.labelKeys.edges];
            for (let e in edges) {
                let edge_input = edges[e], edge_label = edge_input[interfaces_1.labelKeys.e_label], edge_type = edge_input[interfaces_1.labelKeys.e_type], target_node_id = edge_input[interfaces_1.labelKeys.e_to], directed = this._config.explicit_direction ? !!edge_input[interfaces_1.labelKeys.e_dir] : this._config.directed, dir_char = directed ? 'd' : 'u', weight_float = JSONInput.handleEdgeWeights(edge_input), weight_info = weight_float === weight_float ? weight_float : DEFAULT_WEIGHT, edge_weight = this._config.weighted ? weight_info : undefined, target_node = graph.hasNodeID(target_node_id) ? graph.getNodeById(target_node_id) : graph.addNodeByID(target_node_id);
                let edge_id = node_id + "_" + target_node_id + "_" + dir_char, edge_id_u2 = target_node_id + "_" + node_id + "_" + dir_char;
                if (graph.hasEdgeID(edge_id)) {
                    continue;
                }
                let edge2 = null;
                if (graph.hasEdgeID(edge_id_u2)) {
                    edge2 = graph.getEdgeById(edge_id_u2);
                }
                if (!directed && edge2) {
                    if (this._config.weighted) {
                        if (edge_weight != edge2.getWeight()) {
                            throw new Error('Input JSON flawed! Found duplicate UNdirected edge of different weights!');
                        }
                    }
                }
                else {
                    const edge = graph.addEdgeByID(edge_id, node, target_node, {
                        label: edge_label,
                        directed: directed,
                        weighted: this._config.weighted,
                        weight: edge_weight,
                        typed: true,
                        type: edge_type
                    });
                    if (edge_label) {
                        edge.setLabel(edge_label);
                    }
                }
            }
        }
        return graph;
    }
    static handleEdgeWeights(edge_input) {
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
    }
}
exports.JSONInput = JSONInput;
