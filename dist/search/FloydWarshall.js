"use strict";
var $SU = require('../utils/structUtils');
function initializeDistsWithEdges(graph) {
    var dists = {}, edges = $SU.mergeObjects([graph.getDirEdges(), graph.getUndEdges()]);
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
function FloydWarshallAPSP(graph) {
    if (graph.nrDirEdges() === 0 && graph.nrUndEdges() === 0) {
        throw new Error("Cowardly refusing to traverse graph without edges.");
    }
    var dists = {}, next = {}, edges = $SU.mergeObjects([graph.getDirEdges(), graph.getUndEdges()]);
    for (var edge in edges) {
        var a = String(edges[edge].getNodes().a.getID());
        var b = String(edges[edge].getNodes().b.getID());
        if (edges[edge].getWeight() <= 0)
            throw new Error('Cannot compute FW on negative edges');
        if (next[a] == null)
            next[a] = {};
        next[a][b] = [b];
        if (!edges[edge].isDirected()) {
            if (next[b] == null)
                next[b] = {};
            next[b][a] = [a];
        }
        if (dists[a] == null)
            dists[a] = {};
        if (dists[b] == null)
            dists[b] = {};
        dists[a][b] = edges[edge].getWeight();
        if (!edges[edge].isDirected()) {
            dists[b][a] = edges[edge].getWeight();
        }
    }
    for (var k in dists) {
        for (var i in dists) {
            for (var j in dists) {
                if (i === j) {
                    continue;
                }
                if (dists[i][k] == null || dists[k][j] == null) {
                    continue;
                }
                if (dists[i][j] == (dists[i][k] + dists[k][j]) && next[i][j] != next[i][k]) {
                    if (next[i][j].indexOf(next[i][k]) < 0) {
                        next[i][j].push(next[i][k].slice(0));
                        next[i][j] = flatten(next[i][j]);
                        (next[i][j]) = next[i][j].filter(function (elem, pos, arr) { return arr.indexOf(elem) == pos; });
                    }
                }
                if ((!dists[i][j] && dists[i][j] != 0) || (dists[i][j] > dists[i][k] + dists[k][j])) {
                    if (next[i] == null)
                        next[i] = {};
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
function flatten(arr) {
    return arr.reduce(function (flat, toFlatten) {
        return flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten);
    }, []);
}
