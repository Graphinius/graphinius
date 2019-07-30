"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const interfaces_1 = require("../interfaces");
class JSONOutput {
    constructor() { }
    writeToJSONFile(filepath, graph) {
        if (typeof window !== 'undefined' && window !== null) {
            throw new Error('cannot write to File inside of Browser');
        }
        fs.writeFileSync(filepath, this.writeToJSONString(graph));
    }
    writeToJSONString(graph) {
        let nodes, node, node_struct, und_edges, dir_edges, edge, coords;
        let result = {
            name: graph._label,
            nodes: graph.nrNodes(),
            dir_e: graph.nrDirEdges(),
            und_e: graph.nrUndEdges(),
            data: {}
        };
        nodes = graph.getNodes();
        for (let node_key in nodes) {
            node = nodes[node_key];
            node_struct = result.data[node.getID()] = {
                [interfaces_1.labelKeys.edges]: []
            };
            if (node.getID() !== node.getLabel()) {
                node_struct[interfaces_1.labelKeys.label] = node.getLabel();
            }
            und_edges = node.undEdges();
            for (let edge_key in und_edges) {
                edge = und_edges[edge_key];
                let endPoints = edge.getNodes();
                let edgeStruct = {
                    [interfaces_1.labelKeys.e_to]: endPoints.a.getID() === node.getID() ? endPoints.b.getID() : endPoints.a.getID(),
                    [interfaces_1.labelKeys.e_dir]: edge.isDirected() ? 1 : 0,
                    [interfaces_1.labelKeys.e_weight]: edge.isWeighted() ? edge.getWeight() : undefined
                };
                if (edge.getID() !== edge.getLabel()) {
                    edgeStruct[interfaces_1.labelKeys.e_label] = edge.getLabel();
                }
                node_struct[interfaces_1.labelKeys.edges].push(edgeStruct);
            }
            dir_edges = node.outEdges();
            for (let edge_key in dir_edges) {
                edge = dir_edges[edge_key];
                let endPoints = edge.getNodes();
                let edgeStruct = {
                    [interfaces_1.labelKeys.e_to]: endPoints.b.getID(),
                    [interfaces_1.labelKeys.e_dir]: edge.isDirected() ? 1 : 0,
                    [interfaces_1.labelKeys.e_weight]: JSONOutput.handleEdgeWeight(edge),
                };
                if (edge.getID() !== edge.getLabel()) {
                    edgeStruct[interfaces_1.labelKeys.e_label] = edge.getLabel();
                }
                node_struct[interfaces_1.labelKeys.edges].push(edgeStruct);
            }
            node_struct[interfaces_1.labelKeys.features] = node.getFeatures();
            if ((coords = node.getFeature(interfaces_1.labelKeys.coords)) != null) {
                node_struct[interfaces_1.labelKeys.coords] = coords;
            }
        }
        return JSON.stringify(result);
    }
    static handleEdgeWeight(edge) {
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
    }
}
exports.JSONOutput = JSONOutput;
