"use strict";
var $FW = require('../search/FloydWarshall');
function inBetweennessCentrality(graph, sparse) {
    var paths;
    paths = $FW.FloydWarshallAPSP(graph)[1];
    var nodes = graph.adjListArray();
    var map = {};
    for (var keyA in nodes) {
        map[keyA] = 0;
    }
    var N = paths.length;
    for (var a = 0; a < N; ++a) {
        for (var b = 0; b < N; ++b) {
            if (a != b && !(paths[a][b].length == 1 && paths[a][b][0] == b)) {
                addBetweeness(a, b, paths, map, a);
            }
        }
    }
    var dem = 0;
    for (var a_1 in map) {
        dem += map[a_1];
    }
    for (var a_2 in map) {
        map[a_2] /= dem;
    }
    return map;
}
exports.inBetweennessCentrality = inBetweennessCentrality;
function addBetweeness(u, v, next, map, start) {
    if (u == v)
        return 1;
    var nodes = 0;
    for (var e = 0; e < next[u][v].length; e++) {
        nodes += addBetweeness(next[u][v][e], v, next, map, start);
    }
    if (u != start) {
        map[u] += nodes;
    }
    return nodes;
}
