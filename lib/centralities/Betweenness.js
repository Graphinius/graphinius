"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var $FW = require("../search/FloydWarshall");
var $JO = require("../search/Johnsons");
function betweennessCentrality(graph, directed, sparse) {
    var paths;
    sparse = sparse || false;
    if (sparse) {
        paths = $JO.Johnsons(graph)[1];
    }
    else {
        paths = $FW.changeNextToDirectParents($FW.FloydWarshallAPSP(graph)[1]);
    }
    var nodes = graph.getNodes();
    var nodeKeys = Object.keys(nodes);
    var map = {};
    for (var key in nodes) {
        map[key] = 0;
    }
    var N = paths.length;
    for (var a = 0; a < N; ++a) {
        for (var b = 0; b < N; ++b) {
            if (a != b && !(paths[a][b].length == 1 && paths[a][b][0] == b) && paths[a][b][0] != null) {
                var tempMap = {};
                var leadArray = [];
                var pathCount = 0;
                do {
                    var tracer = b;
                    var leadCounter = 0;
                    pathCount++;
                    while (true) {
                        var previous = paths[a][tracer];
                        var terminate = false;
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
                for (var key in tempMap) {
                    var mapKey = nodeKeys[key];
                    map[mapKey] += tempMap[key] / pathCount;
                }
            }
        }
    }
    return map;
}
exports.betweennessCentrality = betweennessCentrality;
