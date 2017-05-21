"use strict";
var $G = require('../core/Graph');
var $SU = require('../utils/structUtils');
function FloydWarshall(graph, sparse) {
    if (sparse === void 0) { sparse = false; }
    if (graph.getMode() === $G.GraphMode.INIT) {
        throw new Error('Cowardly refusing to traverse graph without edges.');
    }
    var dist = {};
    var next = {};
    var edges = $SU.mergeObjects([graph.getDirEdges(), graph.getUndEdges()]);
    var nodes = graph.getNodes();
    var adj_list = graph.adjList();
    for (var keyA in nodes) {
        dist[keyA] = {};
        next[keyA] = [];
    }
    for (var keyA in nodes) {
        for (var keyB in nodes) {
            if (keyA === keyB) {
                dist[keyA][keyA] = 0;
                next[keyA][keyA] = [];
                next[keyA][keyA].push(-1);
            }
            else {
                dist[keyA][keyB] = Number.MAX_VALUE;
                next[keyA][keyB] = [];
            }
        }
    }
    for (var key in edges) {
        var edge = graph.getEdgeById(key);
        var a = edge.getNodes().a.getID();
        var b = edge.getNodes().b.getID();
        if (edge.getWeight() == null || edge.getNodes().a.getID() == edge.getNodes().b.getID()) { }
        else {
            if (!edge.isDirected()) {
                dist[edge.getNodes().b.getID()][edge.getNodes().a.getID()] = edge.getWeight();
                next[b][a] = [];
                next[b][a].push(a);
            }
            dist[edge.getNodes().a.getID()][edge.getNodes().b.getID()] = edge.getWeight();
            next[a][b] = [];
            next[a][b].push(b);
        }
    }
    if (sparse) {
        adj_list = graph.adjList(true);
        var keys = Object.keys(adj_list);
        var pair_count = 0;
        for (var k in adj_list) {
            for (var i in adj_list[k]) {
                for (var j in adj_list[k]) {
                    pair_count++;
                    if (dist[i][k] == null || dist[j][k] == null) {
                        continue;
                    }
                    if (dist[i][j] > dist[i][k] + dist[k][j]) {
                        dist[i][j] = dist[i][k] + dist[k][j];
                        next[i][j] = [];
                        next[i][j].push(k);
                        adj_list[i][j] = dist[i][j];
                    }
                    else if (dist[i][k] + dist[k][j] == dist[i][j] && k != j && k != i)
                        next[i][j].push(k);
                }
            }
        }
    }
    else {
        for (var k in nodes)
            for (var i in nodes)
                for (var j in nodes)
                    if (dist[i][j] > dist[i][k] + dist[k][j]) {
                        dist[i][j] = dist[i][k] + dist[k][j];
                        next[i][j] = [];
                        next[i][j].push(k);
                    }
                    else if (dist[i][k] + dist[k][j] == dist[i][j] && k != j && k != i)
                        next[i][j].push(k);
    }
    var ret = {};
    ret["dist"] = dist;
    ret["next"] = next;
    return [dist, next];
}
exports.FloydWarshall = FloydWarshall;
function getShortestPath(next, i, j) {
    var allPaths = [];
    var c = 0;
    console.log(i + " j:" + j);
    if (!isEmpty(next[i][j]))
        for (var k in next[i][j])
            if (next[i][j][k] == -1) {
                allPaths.push([i, j]);
                c++;
            }
            else {
                var nk = next[i][j][k];
                var paths_I_K = getShortestPath(next, i, nk);
                var paths_K_J = getShortestPath(next, nk, j);
                for (var i_k in paths_I_K)
                    for (var k_j in paths_K_J) {
                        var i_1 = paths_K_J[i_k].pop();
                        allPaths.push([i_1, paths_K_J[k_j]]);
                    }
            }
    return allPaths;
}
function getAllShortestPaths(graph, nextMatrix) {
    var ret = {};
    for (var k in graph.getNodes()) {
        for (var i in graph.getNodes())
            ret[k] = getShortestPath(nextMatrix, k, i);
    }
    return ret;
}
exports.getAllShortestPaths = getAllShortestPaths;
var hasOwnProperty = Object.prototype.hasOwnProperty;
function isEmpty(obj) {
    if (obj == null)
        return true;
    if (obj.length > 0)
        return false;
    if (obj.length === 0)
        return true;
    if (typeof obj !== "object")
        return true;
    for (var key in obj) {
        if (hasOwnProperty.call(obj, key))
            return false;
    }
    return true;
}
