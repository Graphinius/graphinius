"use strict";
var $G = require('../core/Graph');
var $SU = require('../utils/structUtils');
function FloydWarshall(graph) {
    if (graph.getMode() === $G.GraphMode.INIT) {
        throw new Error('Cowardly refusing to traverse graph without edges.');
    }
    var dist = [];
    var edges = $SU.mergeObjects([graph.getDirEdges(), graph.getUndEdges()]);
    var nodes = graph.getNodes();
    for (var keyA in nodes) {
        dist[keyA] = [];
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
    for (var k in nodes)
        for (var i in nodes)
            for (var j in nodes)
                if (dist[i][j] > dist[i][k] + dist[k][j])
                    dist[i][j] = dist[i][k] + dist[k][j];
    return dist;
}
exports.FloydWarshall = FloydWarshall;
