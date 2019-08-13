"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var interfaces_1 = require("../interfaces");
var BaseEdge_1 = require("../../core/base/BaseEdge");
var BaseNode_1 = require("../../core/base/BaseNode");
var Logger_1 = require("../../utils/Logger");
var logger = new Logger_1.Logger();
var JSONOutput = (function () {
    function JSONOutput() {
    }
    JSONOutput.prototype.writeToJSONFile = function (filepath, graph) {
        if (typeof window !== 'undefined' && window !== null) {
            throw new Error('cannot write to File inside of Browser');
        }
        fs.writeFileSync(filepath, this.writeToJSONString(graph));
    };
    JSONOutput.prototype.writeToJSONString = function (graph) {
        var _a, _b, _c;
        var nodes, node, node_struct, und_edges, dir_edges, edge, coords;
        var result = {
            name: graph.label,
            nodes: graph.nrNodes(),
            dir_e: graph.nrDirEdges(),
            und_e: graph.nrUndEdges(),
            data: {}
        };
        nodes = graph.getNodes();
        for (var node_key in nodes) {
            node = nodes[node_key];
            node_struct = result.data[node.getID()] = (_a = {},
                _a[interfaces_1.labelKeys.edges] = [],
                _a);
            if (node.getID() !== node.getLabel()) {
                node_struct[interfaces_1.labelKeys.n_label] = node.label;
            }
            if (BaseNode_1.BaseNode.isTyped(node)) {
                node_struct[interfaces_1.labelKeys.n_type] = node.type;
            }
            und_edges = node.undEdges();
            for (var edge_key in und_edges) {
                edge = und_edges[edge_key];
                var endPoints = edge.getNodes();
                var edgeStruct = (_b = {},
                    _b[interfaces_1.labelKeys.e_to] = endPoints.a.getID() === node.getID() ? endPoints.b.getID() : endPoints.a.getID(),
                    _b[interfaces_1.labelKeys.e_dir] = edge.isDirected() ? 1 : 0,
                    _b[interfaces_1.labelKeys.e_weight] = JSONOutput.handleEdgeWeight(edge),
                    _b);
                if (edge.getID() !== edge.getLabel()) {
                    edgeStruct[interfaces_1.labelKeys.e_label] = edge.getLabel();
                }
                if (BaseEdge_1.BaseEdge.isTyped(edge)) {
                    edgeStruct[interfaces_1.labelKeys.e_type] = edge.type;
                }
                node_struct[interfaces_1.labelKeys.edges].push(edgeStruct);
            }
            dir_edges = node.outEdges();
            for (var edge_key in dir_edges) {
                edge = dir_edges[edge_key];
                var endPoints = edge.getNodes();
                var edgeStruct = (_c = {},
                    _c[interfaces_1.labelKeys.e_to] = endPoints.b.getID(),
                    _c[interfaces_1.labelKeys.e_dir] = edge.isDirected() ? 1 : 0,
                    _c[interfaces_1.labelKeys.e_weight] = JSONOutput.handleEdgeWeight(edge),
                    _c);
                if (edge.getID() !== edge.getLabel()) {
                    edgeStruct[interfaces_1.labelKeys.e_label] = edge.getLabel();
                }
                if (BaseEdge_1.BaseEdge.isTyped(edge)) {
                    edgeStruct[interfaces_1.labelKeys.e_type] = edge.type;
                }
                node_struct[interfaces_1.labelKeys.edges].push(edgeStruct);
            }
            node_struct[interfaces_1.labelKeys.n_features] = node.getFeatures();
            if ((coords = node.getFeature(interfaces_1.labelKeys.coords)) != null) {
                node_struct[interfaces_1.labelKeys.coords] = coords;
            }
        }
        return JSON.stringify(result);
    };
    JSONOutput.handleEdgeWeight = function (edge) {
        if (!edge.isWeighted()) {
            return undefined;
        }
        switch (edge.getWeight()) {
            case Number.POSITIVE_INFINITY:
                return 'Infinity';
            case Number.NEGATIVE_INFINITY:
                return '-Infinity';
            case Number.MAX_VALUE:
                return 'MAX';
            case Number.MIN_VALUE:
                return 'MIN';
            default:
                return edge.getWeight();
        }
    };
    return JSONOutput;
}());
exports.JSONOutput = JSONOutput;
