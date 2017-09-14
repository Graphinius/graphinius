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
    if (sparse) {
        throw new Error("Not implemented yet");
    }
    else
        paths = $FW.FloydWarshallAPSP(graph)[1];
    var nodes = graph.adjListArray();
    var map = {};
    for (var keyA in nodes) {
        map[keyA] = 0;
    }
    var N = paths.length;
    for (var a = 0; a < N; ++a) {
        for (var b = 0; b < N; ++b) {
            if (a != b && paths[a][b].indexOf(b) < 0) {
                addBetweeness(a, b, paths, map, a);
            }
        }
    }
    var dem = 0;
    for (var a_1 in map) {
        dem += map[a_1];
    }
    for (var a_2 in map) {
        console.log(a_2 + " " + map[a_2] + "/" + dem);
        map[a_2] /= dem;
    }
    return map;
}
exports.inBetweennessCentrality = inBetweennessCentrality;
function addBetweeness(u, v, next, map, start) {
    if (u == v)
        return 1;
    var nodes = 0;
    for (var _i = 0, _a = next[u][v]; _i < _a.length; _i++) {
        var e = _a[_i];
        nodes += addBetweeness(e, v, next, map, start);
    }
    if (u != start) {
        if (u == 1)
            console.log("Adding from " + start + " to " + v + " to:" + u + " " + nodes);
        map[u] += nodes;
    }
    return nodes;
}
