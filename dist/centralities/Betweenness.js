"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const $FW = require("../search/FloydWarshall");
const $JO = require("../search/Johnsons");
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
    let nodeKeys = Object.keys(nodes);
    let map = {};
    for (let key in nodes) {
        map[key] = 0;
    }
    let N = paths.length;
    for (var a = 0; a < N; ++a) {
        for (var b = 0; b < N; ++b) {
            if (a != b && !(paths[a][b].length == 1 && paths[a][b][0] == b) && paths[a][b][0] != null) {
                let tempMap = {};
                let leadArray = [];
                let pathCount = 0;
                do {
                    let tracer = b;
                    let leadCounter = 0;
                    pathCount++;
                    while (true) {
                        let previous = paths[a][tracer];
                        let terminate = false;
                        if (previous.length == 1 && previous[0] == tracer) {
                            break;
                        }
                        else if (previous.length == 1) {
                            tracer = previous[0];
                            tracer in tempMap ? tempMap[tracer] += 1 : tempMap[tracer] = 1;
                        }
                        if (previous.length > 1) {
                            if (leadArray.length == 0) {
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
                            else {
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
                    if (leadArray.length > 0) {
                        leadArray[leadArray.length - 1][0]++;
                        while (leadArray[leadArray.length - 1][0] == leadArray[leadArray.length - 1][1]) {
                            leadArray.splice(leadArray.length - 1, 1);
                            if (leadArray.length == 0) {
                                break;
                            }
                            leadArray[leadArray.length - 1][0]++;
                        }
                    }
                } while (leadArray.length != 0);
                for (let key in tempMap) {
                    let mapKey = nodeKeys[key];
                    map[mapKey] += tempMap[key] / pathCount;
                }
            }
        }
    }
    return map;
}
exports.betweennessCentrality = betweennessCentrality;
