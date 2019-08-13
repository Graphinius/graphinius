"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var $PFS = require("../search/PFS");
var $FW = require("../search/FloydWarshall");
var ClosenessCentrality = (function () {
    function ClosenessCentrality() {
    }
    ClosenessCentrality.prototype.getCentralityMapFW = function (graph) {
        var dists = $FW.FloydWarshallArray(graph);
        var ret = [];
        var N = dists.length;
        for (var a = 0; a < N; ++a) {
            var sum = 0;
            for (var b = 0; b < N; ++b) {
                if (dists[a][b] != Number.POSITIVE_INFINITY)
                    sum += dists[a][b];
            }
            ret[a] = 1 / sum;
        }
        return ret;
    };
    ClosenessCentrality.prototype.getCentralityMap = function (graph) {
        var pfs_config = $PFS.preparePFSStandardConfig();
        var accumulated_distance = 0;
        var not_encountered = function (context) {
            accumulated_distance += context.current.best + (isNaN(context.next.edge.getWeight()) ? 1 : context.next.edge.getWeight());
        };
        var betterPathFound = function (context) {
            accumulated_distance -= pfs_config.result[context.next.node.getID()].distance - context.proposed_dist;
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
                $PFS.PFS(graph, node, pfs_config);
                ret[key] = 1 / accumulated_distance;
            }
        }
        return ret;
    };
    return ClosenessCentrality;
}());
exports.ClosenessCentrality = ClosenessCentrality;
