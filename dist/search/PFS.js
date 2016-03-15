/// <reference path="../../typings/tsd.d.ts" />
"use strict";
var $G = require('../core/Graph');
var $BFS = require('./BFS');
/**
 * Priority first search on BFS
 *
 * By default we are going to implement
 * greedy best-first-search (pure heuristic search)
 * which expands the path along the edges
 * of least weight, if no other cost function is given
 *
 * @param graph
 * @param v
 * @param config
 * @constructor
 */
function PFS_BFS(graph, v, config) {
    var config = config || preparePFSBFSStandardConfig(), bfs_config = $BFS.prepareBFSStandardConfig();
    bfs_config.callbacks.sort_nodes = config.cost_function;
    bfs_config.dir_mode = config.dir_mode;
    return $BFS.BFS(graph, v, bfs_config);
}
exports.PFS_BFS = PFS_BFS;
function preparePFSBFSStandardConfig() {
    var config = {
        dir_mode: $G.GraphMode.MIXED,
        cost_function: null
    };
    config.cost_function = function (context) {
        return context.adj_nodes.sort(function (a, b) {
            return a.edge.getWeight() - b.edge.getWeight();
        });
    };
    return config;
}
exports.preparePFSBFSStandardConfig = preparePFSBFSStandardConfig;
/**
 * Priority first search on DFS
 *
 * Same default heuristics as PFS_BFS
 *
 * @param config
 * @constructor
 */
function PFS_DFS(config) {
}
exports.PFS_DFS = PFS_DFS;
function preparePFSDFSStandardConfig() {
    var config = {
        dir_mode: $G.GraphMode.MIXED,
        cost_function: null
    };
    config.cost_function = function (context) {
        return context.adj_nodes.sort(function (a, b) {
            return a.edge.getWeight() - b.edge.getWeight();
        });
    };
    return config;
}
exports.preparePFSDFSStandardConfig = preparePFSDFSStandardConfig;
