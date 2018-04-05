"use strict";
/// <reference path="../../typings/tsd.d.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
var $SU = require("../utils/structUtils");
/**
 * Initializes the distance matrix from each node to all other node
 * using the edges of the graph
 *
 * @param graph the graph for which to calculate the distances
 * @returns m*m matrix of values
 * @constructor
 */
//returns the array dists, 
//which is a 2d array
//containing initial distance values after going through the edges
function initializeDistsWithEdges(graph) {
    //info: here, dists is a dictionary, not yet an array
    var dists = {}, 
    //info: the getters below give a dict as an output
    edges = $SU.mergeObjects([graph.getDirEdges(), graph.getUndEdges()]);
    for (var edge in edges) {
        var a = edges[edge].getNodes().a.getID();
        var b = edges[edge].getNodes().b.getID();
        if (dists[a] == null)
            dists[a] = {};
        dists[a][b] = (isNaN(edges[edge].getWeight()) ? 1 : edges[edge].getWeight());
        if (!edges[edge].isDirected()) {
            if (dists[b] == null)
                dists[b] = {};
            dists[b][a] = (isNaN(edges[edge].getWeight()) ? 1 : edges[edge].getWeight());
        }
    }
    return dists;
}
/**
 * Floyd-Warshall - we mostly use it to get In-betweenness
 * of a graph. We use the standard algorithm and save all
 * the shortest paths we find.
 *
 * @param graph the graph to perform Floyd-Warshall on
 * @returns m*m matrix of values, m*m*m matrix of neighbors
 * @constructor
 */
//returns a 2d array dists and a 3d array next (sort of parent nodes)
//going through each possible intermediate nodes (labeled as k), 
//checking if k introduces a shorter path between the nodes i and j
function FloydWarshallAPSP(graph) {
    if (graph.nrDirEdges() === 0 && graph.nrUndEdges() === 0) {
        throw new Error("Cowardly refusing to traverse graph without edges.");
    }
    var dists = graph.adjListArray();
    var next = graph.nextArray();
    var N = dists.length;
    for (var k = 0; k < N; ++k) {
        for (var i = 0; i < N; ++i) {
            for (var j = 0; j < N; ++j) {
                //-new fix from Rita, i!=j -> if it is not there, zero-weight edges generate false parents
                if (dists[i][j] == (dists[i][k] + dists[k][j]) && k != i && k != j && i != j) {
                    //original line of code
                    //next[i][j] = $SU.mergeOrderedArraysNoDups(next[i][j], next[i][k]);
                    //-a new fix from Rita- However, this fix makes it faster on the midsize graph!
                    //if a node is unreachable, the corresponding value in next should not be updated, but stay null
                    if (dists[i][j] == Number.POSITIVE_INFINITY) {
                        continue;
                    }
                    else {
                        next[i][j] = $SU.mergeOrderedArraysNoDups(next[i][j], next[i][k]);
                    }
                }
                if ((!dists[i][j] && dists[i][j] != 0) || (dists[i][j] > dists[i][k] + dists[k][j])) {
                    //info: slice(0) returns the array itself, unmodified
                    //so practically copying the array contents next [i][k] into the array next [i][j]
                    next[i][j] = next[i][k].slice(0);
                    dists[i][j] = dists[i][k] + dists[k][j];
                }
            }
        }
    }
    return [dists, next];
}
exports.FloydWarshallAPSP = FloydWarshallAPSP;
/**
 * Floyd-Warshall - we mostly use it for Closeness centrality.
 * This is the array version, which means the returned matrix
 * is not accessible with node IDs but rather with their indices.
 * It also is faster than the dict version.
 *
 * @param graph the graph to perform Floyd-Warshall on
 * @returns m*m matrix of values
 * @constructor
 */
function FloydWarshallArray(graph) {
    if (graph.nrDirEdges() === 0 && graph.nrUndEdges() === 0) {
        throw new Error("Cowardly refusing to traverse graph without edges.");
    }
    var dists = graph.adjListArray();
    var N = dists.length;
    for (var k = 0; k < N; ++k) {
        for (var i = 0; i < N; ++i) {
            for (var j = 0; j < N; ++j) {
                if (dists[i][j] > dists[i][k] + dists[k][j]) {
                    dists[i][j] = dists[i][k] + dists[k][j];
                }
            }
        }
    }
    return dists;
}
exports.FloydWarshallArray = FloydWarshallArray;
/**
 * Floyd-Warshall - we mostly use it for Closeness centrality.
 * This is the dict version, which means the returned matrix
 * is accessible with node IDs
 *
 * @param graph the graph to perform Floyd-Warshall on
 * @returns m*m matrix of values
 * @constructor
 */
function FloydWarshall(graph) {
    if (graph.nrDirEdges() === 0 && graph.nrUndEdges() === 0) {
        throw new Error("Cowardly refusing to traverse graph without edges.");
    }
    var dists = initializeDistsWithEdges(graph);
    for (var k in dists) {
        for (var i in dists) {
            for (var j in dists) {
                if (i === j) {
                    continue;
                }
                if (dists[i][k] == null || dists[k][j] == null) {
                    continue;
                }
                if ((!dists[i][j] && dists[i][j] != 0) || (dists[i][j] > dists[i][k] + dists[k][j])) {
                    dists[i][j] = dists[i][k] + dists[k][j];
                }
            }
        }
    }
    return dists;
}
exports.FloydWarshall = FloydWarshall;
function changeNextToDirectParents(input) {
    var output = [];
    //build the output and make it a copy of the input
    for (var a = 0; a < input.length; a++) {
        output.push([]);
        for (var b = 0; b < input.length; b++) {
            output[a].push([]);
            output[a][b] = input[a][b];
        }
    }
    for (var a = 0; a < input.length; a++) {
        for (var b = 0; b < input.length; b++) {
            //when unreachable, no update needed
            if (input[a][b][0] == null) {
                continue;
            }
            else if (a != b && !(input[a][b].length === 1 && input[a][b][0] === b)) {
                output[a][b] = [];
                findDirectParents(a, b, input, output);
            }
        }
    }
    return output;
}
exports.changeNextToDirectParents = changeNextToDirectParents;
function findDirectParents(u, v, inNext, outNext) {
    //console.log("\n new call with " + u + " , " + v)
    var nodesInTracking = [u];
    var counter = 0;
    while (nodesInTracking.length > 0) {
        //console.log("nodesInTracking: " + nodesInTracking);
        var currNode = nodesInTracking.pop();
        //console.log("currNode= " + currNode);
        //the starting node u must never be considered more than once, it may give an infinite loop!
        if (currNode == u && counter > 0) {
            continue;
        }
        else {
            for (var e = 0; e < inNext[currNode][v].length; e++) {
                //if counter ==0, currNode is the start node u
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
