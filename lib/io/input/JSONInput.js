"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const BaseGraph_1 = require("../../core/base/BaseGraph");
const $R = require("../../utils/RemoteUtils");
const interfaces_1 = require("../interfaces");
const Dupes_1 = require("../common/Dupes");
const uuid = require("uuid");
const v4 = uuid.v4;
const Logger_1 = require("../../utils/Logger");
const logger = new Logger_1.Logger();
const DEFAULT_WEIGHT = 1;
class JSONInput {
    constructor(config = {}) {
        this._config = {
            explicit_direction: config.explicit_direction != null ? config.explicit_direction : true,
            directed: config.directed != null ? config.directed : false,
            weighted: config.weighted != null ? config.weighted : false,
            dupeCheck: config.dupeCheck != null ? config.dupeCheck : true
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
        const edc = new Dupes_1.EdgeDupeChecker(graph);
        this.addNodesToGraph(json, graph);
        for (let node_id in json.data) {
            let node = graph.getNodeById(node_id);
            let edges = json.data[node_id][interfaces_1.labelKeys.edges];
            for (let e in edges) {
                const edge_input = edges[e];
                const target_node = this.getTargetNode(graph, edge_input);
                const edge_label = edge_input[interfaces_1.labelKeys.e_label];
                const edge_type = edge_input[interfaces_1.labelKeys.e_type];
                const directed = this._config.explicit_direction ? !!edge_input[interfaces_1.labelKeys.e_dir] : this._config.directed;
                const weight_float = JSONInput.handleEdgeWeights(edge_input);
                const weight_info = weight_float === weight_float ? weight_float : DEFAULT_WEIGHT;
                const edge_weight = this._config.weighted ? weight_info : undefined;
                const target_node_id = edge_input[interfaces_1.labelKeys.e_to];
                const dir_char = directed ? 'd' : 'u';
                const edge_id = node_id + "_" + target_node_id + "_" + dir_char;
                const newEdge = {
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
                    logger.log(`Edge ${edge_label} is a duplicate according to assumptions... omitting.`);
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
    }
    addNodesToGraph(json, graph) {
        let coords_json, coords, coord_idx, features;
        for (let node_id in json.data) {
            const type = BaseGraph_1.BaseGraph.isTyped(graph) ? json.data[node_id][interfaces_1.labelKeys.n_type] : null;
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
    }
    getTargetNode(graph, edge_input) {
        const target_node_id = edge_input[interfaces_1.labelKeys.e_to];
        const target_node = graph.getNodeById(target_node_id);
        if (!target_node) {
            throw new Error('Node referenced by edge does not exist');
        }
        return target_node;
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
