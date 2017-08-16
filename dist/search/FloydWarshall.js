"use strict";
var $G = require('../core/Graph');
var $SU = require('../utils/structUtils');
function FloydWarshallSparse(graph) {
    if (graph.getMode() === $G.GraphMode.INIT) {
        throw new Error('Cowardly refusing to traverse graph without edges.');
    }
    var nodes = graph.getNodes();
    var adj_list = graph.adjListDict(true, true);
    var next = {}, edges = $SU.mergeObjects([graph.getDirEdges(), graph.getUndEdges()]);
    for (var edge in edges) {
        if (next[edges[edge].getNodes().a.getID()] == null)
            next[edges[edge].getNodes().a.getID()] = {};
        next[edges[edge].getNodes().a.getID()][edges[edge].getNodes().b.getID()] = edges[edge].getNodes().a.getID();
    }
    for (var k in adj_list) {
        for (var i in adj_list[k]) {
            for (var j in adj_list[k]) {
                if (i === j) {
                    continue;
                }
                if (!adj_list[i][j] || (adj_list[i][j] > adj_list[i][k] + adj_list[k][j])) {
                    adj_list[i][j] = adj_list[i][k] + adj_list[k][j];
                    if (next[i] == null)
                        next[i] = {};
                    next[i][j] = next[i][k];
                }
            }
        }
    }
    return [adj_list, next];
}
exports.FloydWarshallSparse = FloydWarshallSparse;
function FloydWarshallDense(graph) {
    var dists = {}, nodes = graph.getNodes(), adj_list = graph.adjListDict(true, true), next = {}, edges = $SU.mergeObjects([graph.getDirEdges(), graph.getUndEdges()]);
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
                    if (checkPathItoK(i, k, j, next) && checkPathKtoJ(i, k, j, next) && next[i][j].indexOf(next[i][k]) < 0) {
                        console.log("Make:" + i + "->" + j + " to " + i + "->" + k + "->" + j);
                        console.log("Add " + next[i][k] + " to " + next[i][j]);
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
function checkPathItoK(i, k, j, next) {
    if (next[i][k] == k || next[i][k].indexOf(k) >= 0)
        return true;
    i = next[i][k];
    if (i == j)
        return false;
    if (i.indexOf(k) < 0) {
        var ret = false;
        for (var _i = 0, k_1 = k; _i < k_1.length; _i++) {
            var e = k_1[_i];
            if (e == k)
                return true;
            if (checkPathItoK(e, k, j, next))
                ret = true;
        }
        if (!ret)
            return false;
    }
    return true;
}
function checkPathKtoJ(i, k, j, next) {
    if (next[k][j] == j)
        return true;
    k = next[k][j];
    if (k.indexOf(j) < 0) {
        var ret = false;
        for (var _i = 0, k_2 = k; _i < k_2.length; _i++) {
            var e = k_2[_i];
            if (e != i) {
                if (checkPathKtoJ(i, e, j, next))
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
