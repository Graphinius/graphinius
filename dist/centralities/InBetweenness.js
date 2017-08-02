"use strict";
var $FW = require('../search/FloydWarshall');
function inBetweennessCentrality(graph, sparse) {
    var paths;
    if (sparse)
        paths = $FW.FloydWarshallSparse(graph)[1];
    else
        paths = $FW.FloydWarshallDense(graph)[1];
    console.log(paths);
    console.log(JSON.stringify(paths, null, 2));
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
function addBetweeness(u, v, next, map, fact, path) {
    if (fact === void 0) { fact = 1; }
    if (path === void 0) { path = []; }
    console.log("u,v:" + u + v + " " + JSON.stringify(next[u][v]) + " ");
    if (next[u][v] == null || path.indexOf(u) >= 0)
        return;
    path.push(u);
    fact = fact / next[u][v].length;
    for (var _i = 0, _a = next[u][v]; _i < _a.length; _i++) {
        var e = _a[_i];
        if (e != v) {
            addBetweeness(e, v, next, map, fact, path.slice(0));
            map[e] += fact;
        }
    }
}
