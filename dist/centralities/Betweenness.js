"use strict";
/// <reference path="../../typings/tsd.d.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
const $FW = require("../search/FloydWarshall");
const $JO = require("../search/Johnsons");
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
    let paths;
    var sparse = sparse || false;
    if (sparse) {
        paths = $JO.Johnsons(graph)[1];
    }
    else {
        paths = $FW.changeNextToDirectParents($FW.FloydWarshallAPSP(graph)[1]);
    }
    let nodes = graph.getNodes();
    //getting the nodeKeys
    let nodeKeys = Object.keys(nodes);
    let map = {};
    for (let key in nodes) {
        //initializing the map which will be returned at the end - should it contain the keys (numbers), or the node IDs?
        map[key] = 0;
    }
    let N = paths.length;
    for (var a = 0; a < N; ++a) {
        for (var b = 0; b < N; ++b) {
            //if self, or b is directly reachable from a and it is the only shortest path, no betweenness score is handed out
            if (a != b && !(paths[a][b].length == 1 && paths[a][b][0] == b) && paths[a][b][0] != null) {
                // console.log("called with a and b: "+a+" , "+b);
                let tempMap = {};
                let leadArray = [];
                let pathCount = 0;
                do {
                    //ends when all paths are traced back
                    let tracer = b;
                    let leadCounter = 0;
                    pathCount++;
                    while (true) {
                        //ends when one path is traced back
                        let previous = paths[a][tracer];
                        let terminate = false;
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
                                let choice = leadArray[leadCounter][0];
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
                for (let key in tempMap) {
                    // console.log("tempMap element " + key);
                    // console.log(tempMap[key]);
                    let mapKey = nodeKeys[key];
                    map[mapKey] += tempMap[key] / pathCount;
                }
            }
        }
    }
    return map;
}
exports.betweennessCentrality = betweennessCentrality;
