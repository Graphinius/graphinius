"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
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
        var result = {
            name: graph._label,
            nodes: graph.nrNodes(),
            dir_edges: graph.nrDirEdges(),
            und_edges: graph.nrUndEdges(),
            data: {}
        };
        nodes = graph.getNodes();
        for (let node_key in nodes) {
            node = nodes[node_key];
            node_struct = result.data[node.getID()] = {
                label: node.getLabel(),
                edges: []
            };
            und_edges = node.undEdges();
            for (let edge_key in und_edges) {
                edge = und_edges[edge_key];
                let connected_nodes = edge.getNodes();
                node_struct.edges.push({
                    to: connected_nodes.a.getID() === node.getID() ? connected_nodes.b.getID() : connected_nodes.a.getID(),
                    directed: edge.isDirected(),
                    weight: edge.isWeighted() ? edge.getWeight() : undefined
                });
            }
            dir_edges = node.outEdges();
            for (let edge_key in dir_edges) {
                edge = dir_edges[edge_key];
                let connected_nodes = edge.getNodes();
                node_struct.edges.push({
                    to: connected_nodes.b.getID(),
                    directed: edge.isDirected(),
                    weight: this.handleEdgeWeight(edge)
                });
            }
            node_struct.features = node.getFeatures();
            if ((coords = node.getFeature('coords')) != null) {
                node_struct['coords'] = coords;
            }
        }
        return JSON.stringify(result);
    }
    handleEdgeWeight(edge) {
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
