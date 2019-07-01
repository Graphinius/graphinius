"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const $PFS = require("../search/PFS");
const $FW = require("../search/FloydWarshall");
class ClosenessCentrality {
    constructor() { }
    getCentralityMapFW(graph) {
        let dists = $FW.FloydWarshallArray(graph);
        let ret = [];
        let N = dists.length;
        for (let a = 0; a < N; ++a) {
            let sum = 0;
            for (let b = 0; b < N; ++b) {
                if (dists[a][b] != Number.POSITIVE_INFINITY)
                    sum += dists[a][b];
            }
            ret[a] = 1 / sum;
        }
        return ret;
    }
    getCentralityMap(graph) {
        let pfs_config = $PFS.preparePFSStandardConfig();
        let accumulated_distance = 0;
        let not_encountered = function (context) {
            accumulated_distance += context.current.best + (isNaN(context.next.edge.getWeight()) ? 1 : context.next.edge.getWeight());
        };
        var betterPathFound = function (context) {
            accumulated_distance -= pfs_config.result[context.next.node.getID()].distance - context.proposed_dist;
        };
        let bp = pfs_config.callbacks.better_path.pop();
        pfs_config.callbacks.better_path.push(betterPathFound);
        pfs_config.callbacks.better_path.push(bp);
        pfs_config.callbacks.not_encountered.push(not_encountered);
        let ret = {};
        for (let key in graph.getNodes()) {
            let node = graph.getNodeById(key);
            if (node != null) {
                accumulated_distance = 0;
                $PFS.PFS(graph, node, pfs_config);
                ret[key] = 1 / accumulated_distance;
            }
        }
        return ret;
    }
}
exports.ClosenessCentrality = ClosenessCentrality;
