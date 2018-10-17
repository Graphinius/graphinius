"use strict";
/// <reference path="../../typings/tsd.d.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
const $SU = require("../utils/structUtils");
/**
 * Initializes the distance matrix from each node to all other node
 * using the edges of the graph
 *
 * @param graph the graph for which to calculate the distances
 * @returns m*m matrix of values
 * @constructor
 */
function initializeDistsWithEdges(graph) {
    let dists = {}, edges = $SU.mergeObjects([graph.getDirEdges(), graph.getUndEdges()]);
    for (let edge in edges) {
        let a = edges[edge].getNodes().a.getID();
        let b = edges[edge].getNodes().b.getID();
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
function FloydWarshallAPSP(graph) {
    if (graph.nrDirEdges() === 0 && graph.nrUndEdges() === 0) {
        throw new Error("Cowardly refusing to traverse graph without edges.");
    }
    let dists = graph.adjListArray();
    let next = graph.nextArray();
    let N = dists.length;
    for (var k = 0; k < N; ++k) {
        for (var i = 0; i < N; ++i) {
            for (var j = 0; j < N; ++j) {
                if (k != i && k != j && i != j && dists[i][j] == (dists[i][k] + dists[k][j])) {
                    //if a node is unreachable, the corresponding value in next should not be updated, but stay null
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
    let dists = graph.adjListArray();
    let N = dists.length;
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
/**
 * Floyd-Warshall - we mostly use it for Closeness centrality.
 * This is the dict version, which means the returned matrix
 * is accessible with node IDs
 *
 * @param graph the graph to perform Floyd-Warshall on
 * @returns m*m matrix of values
 * @constructor
 */
function FloydWarshallDict(graph) {
    if (graph.nrDirEdges() === 0 && graph.nrUndEdges() === 0) {
        throw new Error("Cowardly refusing to traverse graph without edges.");
    }
    let dists = initializeDistsWithEdges(graph);
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
exports.FloydWarshallDict = FloydWarshallDict;
function changeNextToDirectParents(input) {
    let output = [];
    for (let a = 0; a < input.length; a++) {
        output.push([]);
        for (let b = 0; b < input.length; b++) {
            output[a].push([]);
            output[a][b] = input[a][b];
        }
    }
    for (let a = 0; a < input.length; a++) {
        for (let b = 0; b < input.length; b++) {
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
    let nodesInTracking = [u];
    let counter = 0;
    while (nodesInTracking.length > 0) {
        let currNode = nodesInTracking.pop();
        if (currNode == u && counter > 0) {
            continue;
        }
        else {
            for (let e = 0; e < inNext[currNode][v].length; e++) {
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
