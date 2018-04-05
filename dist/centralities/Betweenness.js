"use strict";
/// <reference path="../../typings/tsd.d.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
var $FW = require("../search/FloydWarshall");
var $JO = require("../search/Johnsons");
/**
 * DEMO Version of a betweenness centrality computed via Johnson's or FloydWarshall algorithm
 *
 * @param graph the graph to perform Floyd-Warshall/Johnsons on
 * @param directed for normalization, not used at the moment
 * @param sparse decides if using the FW (dense) or Johnsons (sparse)
 *
 * @returns m*m matrix of values (dist), m*m*m matrix of neighbors (next)
 * @constructor
 *
 * @comment function gives the correct results but is slow.
 *
 * !!! DO NOT USE FOR PRODUCTION !!!
 *
 * @todo decide if we still need it...
 */
function betweennessCentrality(graph, directed, sparse) {
    var paths;
    var sparse = sparse || false;
    if (sparse) {
        paths = $JO.Johnsons(graph)[1];
    }
    else {
        paths = $FW.changeNextToDirectParents($FW.FloydWarshallAPSP(graph)[1]);
    }
    var nodes = graph.getNodes();
    //getting the nodeKeys
    var nodeKeys = Object.keys(nodes);
    var map = {};
    for (var key in nodes) {
        //initializing the map which will be returned at the end - should it contain the keys (numbers), or the node IDs?
        map[key] = 0;
    }
    var N = paths.length;
    for (var a = 0; a < N; ++a) {
        for (var b = 0; b < N; ++b) {
            //if self, or b is directly reachable from a and it is the only shortest path, no betweenness score is handed out
            if (a != b && !(paths[a][b].length == 1 && paths[a][b][0] == b) && paths[a][b][0] != null) {
                // console.log("called with a and b: "+a+" , "+b);
                var tempMap = {};
                var leadArray = [];
                var pathCount = 0;
                do {
                    //ends when all paths are traced back
                    var tracer = b;
                    var leadCounter = 0;
                    pathCount++;
                    while (true) {
                        //ends when one path is traced back
                        var previous = paths[a][tracer];
                        var terminate = false;
                        //no branching: 
                        if (previous.length == 1 && previous[0] == tracer) {
                            break;
                        }
                        else if (previous.length == 1) {
                            tracer = previous[0];
                            //scoring on the fly
                            tracer in tempMap ? tempMap[tracer] += 1 : tempMap[tracer] = 1;
                        }
                        //if there is a branching:
                        //handle reaching the terminal node here too!          
                        if (previous.length > 1) {
                            //case: leadArray is empty and we find a branch
                            if (leadArray.length == 0) {
                                //leave a trace in the leadArray
                                leadArray.push([0, previous.length]);
                                if (previous[0] == tracer) {
                                    terminate = true;
                                }
                                else {
                                    tracer = previous[0];
                                    tracer in tempMap ? tempMap[tracer] += 1 : tempMap[tracer] = 1;
                                }
                                leadCounter++;
                            }
                            //case: branch is covered by the leadArray
                            else if (leadCounter < leadArray.length) {
                                var choice = leadArray[leadCounter][0];
                                if (previous[choice] == tracer) {
                                    terminate = true;
                                }
                                else {
                                    tracer = previous[choice];
                                    tracer in tempMap ? tempMap[tracer] += 1 : tempMap[tracer] = 1;
                                }
                                leadCounter++;
                            }
                            //case: branch is beyond the leadArray (new branching encountered)
                            else {
                                //leave a trace in the leadArray
                                leadArray.push([0, previous.length]);
                                if (previous[0] == tracer) {
                                    terminate = true;
                                }
                                else {
                                    tracer = previous[0];
                                    tracer in tempMap ? tempMap[tracer] += 1 : tempMap[tracer] = 1;
                                }
                                leadCounter++;
                            }
                        }
                        if (terminate) {
                            break;
                        }
                    }
                    // here I need to update the leadArray, if not empty
                    //reminder: each subarray in leadArray: [current branchpoint, length]
                    if (leadArray.length > 0) {
                        leadArray[leadArray.length - 1][0]++;
                        while (leadArray[leadArray.length - 1][0] == leadArray[leadArray.length - 1][1]) {
                            //then remove last item from leadArray
                            leadArray.splice(leadArray.length - 1, 1);
                            if (leadArray.length == 0) {
                                break;
                            }
                            leadArray[leadArray.length - 1][0]++;
                        }
                    }
                    //console.log("one round over, path count: " + pathCount);
                } while (leadArray.length != 0);
                //now put the correct scores into the final map
                //be careful, the return map uses letters as nodekeys! - one must transform, otherwise one gets rubbish
                for (var key in tempMap) {
                    // console.log("tempMap element " + key);
                    // console.log(tempMap[key]);
                    var mapKey = nodeKeys[key];
                    map[mapKey] += tempMap[key] / pathCount;
                }
            }
        }
    }
    return map;
}
exports.betweennessCentrality = betweennessCentrality;
