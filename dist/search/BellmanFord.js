"use strict";
/// <reference path="../../typings/tsd.d.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
var PFS_1 = require("./PFS");
/**
 *
 * @param graph
 * @param start
 */
function BFSanityChecks(graph, start) {
    if (graph == null || start == null) {
        throw new Error('Graph as well as start node have to be valid objects.');
    }
    if (graph.nrDirEdges() === 0 && graph.nrUndEdges() === 0) {
        throw new Error('Cowardly refusing to traverse a graph without edges.');
    }
    if (!graph.hasNodeID(start.getID())) {
        throw new Error('Cannot start from an outside node.');
    }
}
function BellmanFordArray(graph, start) {
    BFSanityChecks(graph, start);
    var distances = [], nodes = graph.getNodes(), edge, node_keys = Object.keys(nodes), node, id_idx_map = {}, bf_edge_entry, new_weight, neg_cycle = false;
    for (var n_idx = 0; n_idx < node_keys.length; ++n_idx) {
        node = nodes[node_keys[n_idx]];
        distances[n_idx] = (node === start) ? 0 : Number.POSITIVE_INFINITY;
        id_idx_map[node.getID()] = n_idx;
    }
    // Initialize an edge array just holding the node indices, weight and directed
    var graph_edges = graph.getDirEdgesArray().concat(graph.getUndEdgesArray());
    var bf_edges = [];
    for (var e_idx = 0; e_idx < graph_edges.length; ++e_idx) {
        edge = graph_edges[e_idx];
        var bf_edge_entry_1 = bf_edges.push([
            id_idx_map[edge.getNodes().a.getID()],
            id_idx_map[edge.getNodes().b.getID()],
            isFinite(edge.getWeight()) ? edge.getWeight() : PFS_1.DEFAULT_WEIGHT,
            edge.isDirected()
        ]);
    }
    for (var i = 0; i < node_keys.length - 1; ++i) {
        for (var e_idx = 0; e_idx < bf_edges.length; ++e_idx) {
            edge = bf_edges[e_idx];
            updateDist(edge[0], edge[1], edge[2]);
            !edge[3] && updateDist(edge[1], edge[0], edge[2]);
        }
    }
    for (var e_idx = 0; e_idx < bf_edges.length; ++e_idx) {
        edge = bf_edges[e_idx];
        if (betterDist(edge[0], edge[1], edge[2]) || (!edge[3] && betterDist(edge[1], edge[0], edge[2]))) {
            neg_cycle = true;
            break;
        }
    }
    function updateDist(u, v, weight) {
        new_weight = distances[u] + weight;
        if (distances[v] > new_weight) {
            distances[v] = new_weight;
        }
    }
    function betterDist(u, v, weight) {
        return (distances[v] > distances[u] + weight);
    }
    return { distances: distances, neg_cycle: neg_cycle };
}
exports.BellmanFordArray = BellmanFordArray;
/**
 *
 * @param graph
 * @param start
 */
function BellmanFordDict(graph, start) {
    BFSanityChecks(graph, start);
    var distances = {}, edges, edge, a, b, weight, new_weight, nodes_size, neg_cycle = false;
    distances = {}; // Reset dists, TODO refactor
    edges = graph.getDirEdgesArray().concat(graph.getUndEdgesArray());
    nodes_size = graph.nrNodes();
    for (var node in graph.getNodes()) {
        distances[node] = Number.POSITIVE_INFINITY;
    }
    distances[start.getID()] = 0;
    for (var i = 0; i < nodes_size - 1; ++i) {
        for (var e_idx = 0; e_idx < edges.length; ++e_idx) {
            edge = edges[e_idx];
            a = edge.getNodes().a.getID();
            b = edge.getNodes().b.getID();
            weight = isFinite(edge.getWeight()) ? edge.getWeight() : PFS_1.DEFAULT_WEIGHT;
            updateDist(a, b, weight);
            !edge.isDirected() && updateDist(b, a, weight);
        }
    }
    for (var edgeID in edges) {
        edge = edges[edgeID];
        a = edge.getNodes().a.getID();
        b = edge.getNodes().b.getID();
        weight = isFinite(edge.getWeight()) ? edge.getWeight() : PFS_1.DEFAULT_WEIGHT;
        if (betterDist(a, b, weight) || (!edge.isDirected() && betterDist(b, a, weight))) {
            neg_cycle = true;
        }
    }
    function updateDist(u, v, weight) {
        new_weight = distances[u] + weight;
        if (distances[v] > new_weight) {
            distances[v] = new_weight;
        }
    }
    function betterDist(u, v, weight) {
        return (distances[v] > distances[u] + weight);
    }
    return { distances: distances, neg_cycle: neg_cycle };
}
exports.BellmanFordDict = BellmanFordDict;
