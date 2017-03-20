"use strict";
var $BFS = require('../search/BFS');
function inBetweennessCentrality(graph, weighted) {
    var ret = {};
    for (var key in graph.getNodes()) {
        var node = graph.getNodeById(key);
        if (node != null) {
            var allDistances = $BFS.BFS(graph, node);
            for (var distanceKey in allDistances) {
                if (ret[distanceKey] == null)
                    ret[distanceKey] = 0;
                ret[distanceKey]++;
            }
        }
    }
    return ret;
}
exports.inBetweennessCentrality = inBetweennessCentrality;
