"use strict";
var $FW = require('../search/FloydWarshall');
var $PFS = require('../search/PFS');
function inBetweennessCentralityDijkstra(graph, weighted) {
    var pfs_config = $PFS.preparePFSStandardConfig();
    if (!weighted && weighted != null)
        pfs_config.evalPriority = function (ne) {
            return $PFS.DEFAULT_WEIGHT;
        };
    var accumulated_distance = 0;
    var not_encountered = function (context) {
        accumulated_distance += context.current.best + context.next.edge.getWeight();
    };
    var betterPathFound = function (context) {
        accumulated_distance -= pfs_config.result[context.next.node.getID()].distance - context.better_dist;
    };
    var bp = pfs_config.callbacks.better_path.pop();
    pfs_config.callbacks.better_path.push(betterPathFound);
    pfs_config.callbacks.better_path.push(bp);
    pfs_config.callbacks.not_encountered.push(not_encountered);
    var ret = {};
    for (var key in graph.getNodes()) {
        var node = graph.getNodeById(key);
        if (node != null) {
            accumulated_distance = 0;
            var allDistances = $PFS.PFS(graph, node, pfs_config);
            ret[key] = 1 / accumulated_distance;
        }
    }
    return ret;
}
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
                nop += addBetweeness(keyA, keyB, paths, map);
            }
        }
    }
    for (var a in map) {
        map[a] /= nop;
    }
    return map;
}
exports.inBetweennessCentrality = inBetweennessCentrality;
function addBetweeness(u, v, next, map, fact) {
    if (fact === void 0) { fact = 0; }
    if (u == v)
        return 0;
    for (var _i = 0, _a = next[u][v]; _i < _a.length; _i++) {
        var e = _a[_i];
        if (e != v) {
            fact += addBetweeness(e, v, next, map, 0);
            map[e] += 1;
            fact++;
        }
    }
    return fact;
}
