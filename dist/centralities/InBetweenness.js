"use strict";
var $FW = require('../search/FloydWarshall');
function inBetweennessCentrality(graph, sparse) {
    var paths;
    if (sparse)
        paths = $FW.FloydWarshallSparse(graph)[1];
    else
        paths = $FW.FloydWarshallDense(graph)[1];
    var nodes = graph.getNodes();
    var map = {};
    for (var keyA in nodes) {
        map[keyA] = 0;
    }
    var nop = 0;
    for (var keyA in nodes) {
        for (var keyB in nodes) {
            if (keyA != keyB && paths[keyA][keyB] != keyB) {
                nop += addBetweeness(keyA, keyB, paths, map, 0, [], keyA) + 1;
            }
        }
    }
    for (var a in map) {
        map[a] /= nop;
    }
    return map;
}
exports.inBetweennessCentrality = inBetweennessCentrality;
function addBetweeness(u, v, next, map, fact, path, ou) {
    if (fact === void 0) { fact = 0; }
    if (path === void 0) { path = []; }
    if (u == v)
        if (path.length <= 1)
            return -2;
        else
            return -1;
    if (path.indexOf(u) >= 0)
        return -1;
    if (next[u][v] == null)
        return -1;
    path.push(u);
    var ef = 1;
    for (var _i = 0, _a = next[u][v]; _i < _a.length; _i++) {
        var e = _a[_i];
        if (e != v && e != ou) {
            fact += addBetweeness(e, v, next, map, -1, path.slice(0), ou);
            fact += ef;
            ef = 2;
            map[e] += 1;
        }
        if (e == ou) {
        }
    }
    return fact;
}
