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
                [interfaces_1.abbs.label]: node.getLabel(),
                [interfaces_1.abbs.edges]: []
            };
            und_edges = node.undEdges();
            for (let edge_key in und_edges) {
                edge = und_edges[edge_key];
                let connected_nodes = edge.getNodes();
                node_struct[interfaces_1.abbs.edges].push({
                    [interfaces_1.abbs.e_to]: connected_nodes.a.getID() === node.getID() ? connected_nodes.b.getID() : connected_nodes.a.getID(),
                    [interfaces_1.abbs.e_dir]: edge.isDirected(),
                    [interfaces_1.abbs.e_weight]: edge.isWeighted() ? edge.getWeight() : undefined
                });
            }
            dir_edges = node.outEdges();
            for (let edge_key in dir_edges) {
                edge = dir_edges[edge_key];
                let connected_nodes = edge.getNodes();
                node_struct[interfaces_1.abbs.edges].push({
                    [interfaces_1.abbs.e_to]: connected_nodes.b.getID(),
                    [interfaces_1.abbs.e_dir]: edge.isDirected(),
                    [interfaces_1.abbs.e_weight]: JSONOutput.handleEdgeWeight(edge)
                });
            }
            node_struct[interfaces_1.abbs.features] = node.getFeatures();
            if ((coords = node.getFeature(interfaces_1.abbs.coords)) != null) {
                node_struct[interfaces_1.abbs.coords] = coords;
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
