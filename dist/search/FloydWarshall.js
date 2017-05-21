"use strict";
var $G = require('../core/Graph');
var $SU = require('../utils/structUtils');
function FloydWarshall(graph, sparse) {
    if (sparse === void 0) { sparse = false; }
    if (graph.getMode() === $G.GraphMode.INIT) {
        throw new Error('Cowardly refusing to traverse graph without edges.');
    }
    var dist = {};
    var edges = $SU.mergeObjects([graph.getDirEdges(), graph.getUndEdges()]);
    var nodes = graph.getNodes();
    var adj_list = graph.adjList();
    for (var keyA in nodes) {
        dist[keyA] = {};
    }
    for (var keyA in nodes) {
        for (var keyB in nodes) {
            if (keyA === keyB)
                dist[keyA][keyB] = 0;
            else
                dist[keyA][keyB] = Number.MAX_VALUE;
        }
    }
    for (var key in edges) {
        var edge = graph.getEdgeById(key);
        if (edge.getWeight() == null || edge.getNodes().a.getID() == edge.getNodes().b.getID()) { }
        else {
            if (!edge.isDirected())
                dist[edge.getNodes().b.getID()][edge.getNodes().a.getID()] = edge.getWeight();
            dist[edge.getNodes().a.getID()][edge.getNodes().b.getID()] = edge.getWeight();
        }
    }
    if (sparse) {
        return computeSparseFW();
    }
    else {
        for (var k in nodes)
            for (var i in nodes)
                for (var j in nodes)
                    if (dist[i][j] > dist[i][k] + dist[k][j])
                        dist[i][j] = dist[i][k] + dist[k][j];
    }
    return dist;
    function computeSparseFW() {
        adj_list = graph.adjList(true);
        var keys = Object.keys(adj_list);
        var pair_count = 0;
        for (var k in adj_list) {
            for (var i in adj_list[k]) {
                for (var j in adj_list[k]) {
                    pair_count++;
                    if (dist[i][k] == null || dist[j][k] == null) {
                        continue;
                    }
                    if (dist[i][j] > dist[i][k] + dist[k][j]) {
                        dist[i][j] = dist[i][k] + dist[k][j];
                        adj_list[i][j] = dist[i][j];
                    }
                }
            }
        }
        console.log("Went over " + pair_count + " pairs.");
        return dist;
    }
}
exports.FloydWarshall = FloydWarshall;
