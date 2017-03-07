"use strict";
var $PFS = require('../search/PFS');
function closenessCentrality(graph) {
    var ret = {};
    for (var key in graph.getNodes()) {
        var n = 1;
        var currAvg = 0;
        var node = graph.getNodeById(key);
        if (node != null) {
            var allDistances = $PFS.PFS(graph, node);
            for (var distanceKey in allDistances) {
                if (distanceKey != key) {
                    currAvg = currAvg + (allDistances[distanceKey].distance - currAvg) / n;
                    n++;
                }
            }
            ret[key] = currAvg;
        }
    }
    return ret;
}
exports.closenessCentrality = closenessCentrality;
