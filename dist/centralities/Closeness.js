"use strict";
var $PFS = require('../search/PFS');
var closenessCentrality = (function () {
    function closenessCentrality() {
    }
    closenessCentrality.prototype.getCentralityMap = function (graph, weighted) {
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
    };
    return closenessCentrality;
}());
exports.closenessCentrality = closenessCentrality;
