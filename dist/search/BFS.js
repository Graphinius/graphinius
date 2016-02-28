/// <reference path="../../typings/tsd.d.ts" />
"use strict";
function BFS(graph, v) {
    var result = {};
    var nodes = graph.getNodes();
    for (var key in nodes) {
        result[key] = {
            distance: Number.POSITIVE_INFINITY,
            parent: null,
            counter: -1
        };
    }
    var counter = 0;
    var queue = [];
    queue.push(v);
    result[v.getID()] = {
        distance: 0,
        parent: v,
        counter: counter++
    };
    var i = 0;
    while (i < queue.length) {
        var current = queue[i++];
        var adj_nodes = current.adjNodes();
        for (var adj_idx in adj_nodes) {
            var adj_node = adj_nodes[adj_idx];
            if (result[adj_node.getID()].distance === Number.POSITIVE_INFINITY) {
                result[adj_node.getID()] = {
                    distance: result[current.getID()].distance + 1,
                    parent: current,
                    counter: counter++
                };
                queue.push(adj_node);
            }
        }
    }
    return result;
}
exports.BFS = BFS;
