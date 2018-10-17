"use strict";
/// <reference path="../../typings/tsd.d.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
const $PFS = require("../search/PFS");
const $FW = require("../search/FloydWarshall");
//Calculates all the shortest path's to all other nodes for all given nodes in the graph
//Returns a map with every node as key and the average distance to all other nodes as value
class closenessCentrality {
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
        //set the config (we want the sum of all edges to become a property of result)
        //a node is encountered the first time
        let not_encountered = function (context) {
            // adding the distance to the accumulated distance
            accumulated_distance += context.current.best + (isNaN(context.next.edge.getWeight()) ? 1 : context.next.edge.getWeight());
        };
        //We found a better path, we need to correct the accumulated distance
        var betterPathFound = function (context) {
            //console.log("correcting distance "+context.current.node.getID()+"->"+context.next.node.getID()+" from " + pfs_config.result[context.next.node.getID()].distance + "to" + context.better_dist);
            accumulated_distance -= pfs_config.result[context.next.node.getID()].distance - context.proposed_dist;
        };
        let bp = pfs_config.callbacks.better_path.pop(); //change the order, otherwise our betterPathFound would not do anything
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
exports.closenessCentrality = closenessCentrality;
