"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var $SU = require("../utils/StructUtils");
var ComputeGraph_1 = require("../core/compute/ComputeGraph");
var DEFAULT_WEIGHT = 1;
function FloydWarshallAPSP(graph) {
    if (graph.nrDirEdges() === 0 && graph.nrUndEdges() === 0) {
        throw new Error("Cowardly refusing to traverse graph without edges.");
    }
    var cg = new ComputeGraph_1.ComputeGraph(graph);
    var dists = cg.adjListArray();
    var next = cg.nextArray();
    var N = dists.length;
    for (var k = 0; k < N; ++k) {
        for (var i = 0; i < N; ++i) {
            for (var j = 0; j < N; ++j) {
                if (k != i && k != j && i != j && dists[i][j] == (dists[i][k] + dists[k][j])) {
                    if (dists[i][j] !== Number.POSITIVE_INFINITY) {
                        next[i][j] = $SU.mergeOrderedArraysNoDups(next[i][j], next[i][k]);
                    }
                }
                if (k != i && k != j && i != j && dists[i][j] > dists[i][k] + dists[k][j]) {
                    next[i][j] = next[i][k].slice(0);
                    dists[i][j] = dists[i][k] + dists[k][j];
                }
            }
        }
    }
    return [dists, next];
}
exports.FloydWarshallAPSP = FloydWarshallAPSP;
function FloydWarshallArray(graph) {
    if (graph.nrDirEdges() === 0 && graph.nrUndEdges() === 0) {
        throw new Error("Cowardly refusing to traverse graph without edges.");
    }
    var cg = new ComputeGraph_1.ComputeGraph(graph);
    var dists = cg.adjListArray();
    var N = dists.length;
    for (var k = 0; k < N; ++k) {
        for (var i = 0; i < N; ++i) {
            for (var j = 0; j < N; ++j) {
                if (k != i && k != j && i != j && dists[i][j] > dists[i][k] + dists[k][j]) {
                    dists[i][j] = dists[i][k] + dists[k][j];
                }
            }
        }
    }
    return dists;
}
exports.FloydWarshallArray = FloydWarshallArray;
function changeNextToDirectParents(input) {
    var output = [];
    for (var a = 0; a < input.length; a++) {
        output.push([]);
        for (var b = 0; b < input.length; b++) {
            output[a].push([]);
            output[a][b] = input[a][b];
        }
    }
    for (var a = 0; a < input.length; a++) {
        for (var b = 0; b < input.length; b++) {
            if (input[a][b][0] != null
                && a != b && !(input[a][b].length === 1
                && input[a][b][0] === b)) {
                output[a][b] = [];
                findDirectParents(a, b, input, output);
            }
        }
    }
    return output;
}
exports.changeNextToDirectParents = changeNextToDirectParents;
function findDirectParents(u, v, inNext, outNext) {
    var nodesInTracking = [u];
    var counter = 0;
    while (nodesInTracking.length > 0) {
        var currNode = nodesInTracking.pop();
        if (currNode == u && counter > 0) {
            continue;
        }
        else {
            for (var e = 0; e < inNext[currNode][v].length; e++) {
                if (inNext[currNode][v][e] == v && counter == 0) {
                    outNext[u][v] = $SU.mergeOrderedArraysNoDups(outNext[u][v], [v]);
                }
                else if (inNext[currNode][v][e] == v) {
                    outNext[u][v] = $SU.mergeOrderedArraysNoDups(outNext[u][v], [currNode]);
                }
                else {
                    nodesInTracking = $SU.mergeOrderedArraysNoDups(nodesInTracking, [inNext[currNode][v][e]]);
                }
            }
        }
        counter++;
    }
}
