"use strict";
var PFS_1 = require("./PFS");
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
function BellmanFordArray(graph, start, cycle) {
    if (cycle === void 0) { cycle = false; }
    BFSanityChecks(graph, start);
    var distArray = [], nodes = graph.getNodes(), edge, node_keys = Object.keys(nodes), node, id_idx_map = {}, bf_edge_entry, new_weight;
    for (var n_idx = 0; n_idx < node_keys.length; ++n_idx) {
        node = nodes[node_keys[n_idx]];
        distArray[n_idx] = (node === start) ? 0 : Number.POSITIVE_INFINITY;
        id_idx_map[node.getID()] = n_idx;
    }
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
    if (cycle) {
        for (var e_idx = 0; e_idx < bf_edges.length; ++e_idx) {
            edge = bf_edges[e_idx];
            if (betterDist(edge[0], edge[1], edge[2]) || (!edge[3] && betterDist(edge[1], edge[0], edge[2]))) {
                return true;
            }
        }
        return false;
    }
    function updateDist(u, v, weight) {
        new_weight = distArray[u] + weight;
        if (distArray[v] > new_weight) {
            distArray[v] = new_weight;
        }
    }
    function betterDist(u, v, weight) {
        return (distArray[v] > distArray[u] + weight);
    }
    return distArray;
}
exports.BellmanFordArray = BellmanFordArray;
function BellmanFordDict(graph, start, cycle) {
    if (cycle === void 0) { cycle = false; }
    BFSanityChecks(graph, start);
    var distDict = {}, edges, edge, a, b, weight, new_weight, nodes_size;
    distDict = {};
    edges = graph.getDirEdgesArray().concat(graph.getUndEdgesArray());
    nodes_size = graph.nrNodes();
    for (var node in graph.getNodes()) {
        distDict[node] = Number.POSITIVE_INFINITY;
    }
    distDict[start.getID()] = 0;
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
    if (cycle) {
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
    }
    function updateDist(u, v, weight) {
        new_weight = distDict[u] + weight;
        if (distDict[v] > new_weight) {
            distDict[v] = new_weight;
        }
    }
    function betterDist(u, v, weight) {
        return (distDict[v] > distDict[u] + weight);
    }
    return distDict;
}
exports.BellmanFordDict = BellmanFordDict;
