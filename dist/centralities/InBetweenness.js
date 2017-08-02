"use strict";
var $FW = require('../search/FloydWarshall');
function inBetweennessCentrality(graph, sparse) {
    var paths;
    if (sparse)
        paths = $FW.FloydWarshallSparse(graph)[1];
    else
        paths = $FW.FloydWarshallDense(graph)[1];
    console.log(paths);
    var nodes = graph.getNodes();
    var map = {};
    for (var keyA in nodes) {
        map[keyA] = 0;
    }
    for (var keyA in nodes) {
        for (var keyB in nodes) {
            addBetweeness(keyA, keyB, paths, map);
        }
    }
    return map;
}
exports.inBetweennessCentrality = inBetweennessCentrality;
function addBetweeness(u, v, next, map) {
    if (next[u][v] == null)
        return;
    while (u != v) {
        u = next[u][v];
        if (u != v) {
            map[u]++;
        }
    }
    return;
}
