"use strict";
var $SU = require('../utils/structUtils');
var PFS_1 = require("./PFS");
var dists = {}, edges, edge, a, b, weight, new_weight, size;
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
function BellmanFord(graph, start) {
    BFSanityChecks(graph, start);
    dists = {};
    edges = $SU.mergeObjects([graph.getDirEdges(), graph.getUndEdges()]);
    size = graph.nrNodes();
    for (var node in graph.getNodes()) {
        dists[node] = Number.POSITIVE_INFINITY;
    }
    dists[start.getID()] = 0;
    for (var i = 0; i < size - 1; ++i) {
        for (var edgeID in edges) {
            edge = edges[edgeID];
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
