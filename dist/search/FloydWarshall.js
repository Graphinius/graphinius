"use strict";
var $G = require('../core/Graph');
function FloydWarshallSparse(graph) {
    if (graph.getMode() === $G.GraphMode.INIT) {
        throw new Error('Cowardly refusing to traverse graph without edges.');
    }
    var nodes = graph.getNodes();
    var adj_list = graph.adjList(true, true);
    var pairs_count = 0;
    for (var k in adj_list) {
        for (var i in adj_list[k]) {
            for (var j in adj_list[k]) {
                ++pairs_count;
                if (i === j) {
                    continue;
                }
                if (!adj_list[i][j] || (adj_list[i][j] > adj_list[i][k] + adj_list[k][j])) {
                    adj_list[i][j] = adj_list[i][k] + adj_list[k][j];
                }
            }
        }
    }
    return adj_list;
}
exports.FloydWarshallSparse = FloydWarshallSparse;
function FloydWarshallDense(graph) {
    var dists = {}, nodes = graph.getNodes(), adj_list = graph.adjList(true, true);
    for (var keyA in nodes) {
        dists[keyA] = {};
        for (var keyB in nodes) {
            var num = +adj_list[keyA][keyB];
            if (num === num) {
                dists[keyA][keyB] = num;
            }
        }
    }
    var pairs_count = 0;
    for (var k in dists) {
        for (var i in dists) {
            for (var j in dists) {
                ++pairs_count;
                if (i === j) {
                    continue;
                }
                if (dists[i][k] == null || dists[k][j] == null) {
                    continue;
                }
                if (!dists[i][j] || (dists[i][j] > dists[i][k] + dists[k][j])) {
                    dists[i][j] = dists[i][k] + dists[k][j];
                }
            }
        }
    }
    return dists;
}
exports.FloydWarshallDense = FloydWarshallDense;
