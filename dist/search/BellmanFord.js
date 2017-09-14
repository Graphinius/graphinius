"use strict";
var PFS_1 = require("./PFS");
var dists = {}, edges, edge, a, b, weight, new_weight, nodes_size;
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
    var dists = [];
    var adj_matrix = graph.adjListArray();
    console.log(adj_matrix);
    var nodes = graph.getNodes(), keys = Object.keys(nodes), node;
    for (var n_idx = 0; n_idx < keys.length; ++n_idx) {
        node = nodes[keys[n_idx]];
        dists[n_idx] = (node === start) ? 0 : Number.POSITIVE_INFINITY;
    }
    return dists;
}
exports.BellmanFordArray = BellmanFordArray;
function BellmanFord(graph, start) {
    BFSanityChecks(graph, start);
    dists = {};
    edges = graph.getDirEdgesArray().concat(graph.getUndEdgesArray());
    nodes_size = graph.nrNodes();
    for (var node in graph.getNodes()) {
        dists[node] = Number.POSITIVE_INFINITY;
    }
    dists[start.getID()] = 0;
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
    function updateDist(u, v, weight) {
        new_weight = dists[u] + weight;
        if (dists[v] > new_weight) {
            dists[v] = new_weight;
        }
    }
    return dists;
}
exports.BellmanFord = BellmanFord;
function hasNegativeCycle(graph, start) {
    dists = BellmanFord(graph, start);
    for (var edgeID in edges) {
        edge = edges[edgeID];
        a = edge.getNodes().a.getID();
        b = edge.getNodes().b.getID();
        weight = isFinite(edge.getWeight()) ? edge.getWeight() : PFS_1.DEFAULT_WEIGHT;
        if (betterDist(a, b, weight) || (!edge.isDirected() && betterDist(b, a, weight))) {
            return true;
        }
    }
    return false;
    function betterDist(u, v, weight) {
        return (dists[v] > dists[u] + weight);
    }
}
exports.hasNegativeCycle = hasNegativeCycle;
