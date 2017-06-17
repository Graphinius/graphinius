"use strict";
var $G = require('../core/Graph');
var $SU = require('../utils/structUtils');
function FloydWarshall(graph, config) {
    if (config === void 0) { config = { directed: false }; }
    if (graph.getMode() === $G.GraphMode.INIT) {
        throw new Error('Cowardly refusing to traverse graph without edges.');
    }
    var edges = $SU.mergeObjects([graph.getDirEdges(), graph.getUndEdges()]);
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
    console.log("Went through " + pairs_count + " candidates for improval");
    return adj_list;
}
exports.FloydWarshall = FloydWarshall;
