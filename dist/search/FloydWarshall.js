"use strict";
var $SU = require('../utils/structUtils');
function FloydWarshallSparse(graph) {
    var dists = {}, next = {}, adj_list = graph.adjListArray(true, true), edges = $SU.mergeObjects([graph.getDirEdges(), graph.getUndEdges()]);
    for (var edge in edges) {
        var a = edges[edge].getNodes().a.getID();
        var b = edges[edge].getNodes().b.getID();
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
        dists[a][b] = edges[edge].getWeight();
        if (!edges[edge].isDirected()) {
            if (dists[b] == null)
                dists[b] = {};
            dists[b][a] = edges[edge].getWeight();
        }
    }
    console.log(adj_list);
    for (var k in adj_list) {
        for (var i in adj_list) {
            for (var j in adj_list) {
                if (i === j) {
                    continue;
                }
                if (dists[i][k] == null || dists[k][j] == null) {
                    continue;
                }
                if (dists[i][j] == (dists[i][k] + dists[k][j]) && next[i][j] != next[i][k]) {
                    if (checkPathItoK(i, k, j, next, [], dists) && checkPathKtoJ(i, k, j, next, [], dists) && next[i][j].indexOf(next[i][k]) < 0) {
                        next[i][j].push(next[i][k].slice(0));
                        next[i][j] = flatten(next[i][j]);
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
exports.FloydWarshallSparse = FloydWarshallSparse;
function FloydWarshallDense(graph) {
    var dists = {}, next = {}, adj_list = graph.adjListArray(true, true), edges = $SU.mergeObjects([graph.getDirEdges(), graph.getUndEdges()]);
    for (var edge in edges) {
        var a = String(edges[edge].getNodes().a.getID());
        var b = String(edges[edge].getNodes().b.getID());
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
        dists[a][b] = edges[edge].getWeight();
        if (!edges[edge].isDirected()) {
            if (dists[b] == null)
                dists[b] = {};
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
                    if (checkPathItoK(i, k, j, next, [], dists) && checkPathKtoJ(i, k, j, next, [], dists) && next[i][j].indexOf(next[i][k]) < 0) {
                        next[i][j].push(next[i][k].slice(0));
                        next[i][j] = flatten(next[i][j]);
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
exports.FloydWarshallDense = FloydWarshallDense;
function FloydWarshall(graph) {
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
function checkPathItoK(i, k, j, next, nullNodes, dists) {
    if (next[i][k] == k || next[i][k].indexOf(k) >= 0)
        return true;
    nullNodes.push(i);
    i = next[i][k];
    if (i == j)
        return false;
    if (i.indexOf(k) < 0) {
        var ret = false;
        for (var _i = 0, i_1 = i; _i < i_1.length; _i++) {
            var e = i_1[_i];
            if (e == k)
                return true;
            if (nullNodes.indexOf(e) < 0) {
                if (checkPathItoK(e, k, j, next, nullNodes.slice(0), dists))
                    ret = true;
            }
        }
        if (!ret)
            return false;
    }
    return true;
}
function checkPathKtoJ(i, k, j, next, nullNodes, dists) {
    if (next[k][j] == j)
        return true;
    nullNodes.push(k);
    k = next[k][j];
    if (k.indexOf(j) < 0) {
        var ret = false;
        for (var _i = 0, k_1 = k; _i < k_1.length; _i++) {
            var e = k_1[_i];
            if (e != i && nullNodes.indexOf(e) < 0) {
                if (checkPathKtoJ(i, e, j, next, nullNodes.slice(0), dists))
                    ret = true;
            }
        }
        if (!ret)
            return false;
    }
    return true;
}
function flatten(arr) {
    return arr.reduce(function (flat, toFlatten) {
        return flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten);
    }, []);
}
