"use strict";
var $G = require('../core/Graph');
var $CB = require('../utils/callbackUtils');
function DFSVisit(graph, current_root, config) {
    var dfsVisitScope = {
        stack: [],
        adj_nodes: [],
        stack_entry: null,
        current: null,
        current_root: current_root
    };
    var config = config || prepareDFSVisitStandardConfig(), callbacks = config.callbacks, dir_mode = config.dir_mode;
    if (graph.getMode() === $G.GraphMode.INIT) {
        throw new Error('Cowardly refusing to traverse graph without edges.');
    }
    if (dir_mode === $G.GraphMode.INIT) {
        throw new Error('Cannot traverse a graph with dir_mode set to INIT.');
    }
    if (callbacks.init_dfs_visit) {
        $CB.execCallbacks(callbacks.init_dfs_visit, dfsVisitScope);
    }
    dfsVisitScope.stack.push({
        node: current_root,
        parent: current_root,
        weight: 0
    });
    while (dfsVisitScope.stack.length) {
        dfsVisitScope.stack_entry = dfsVisitScope.stack.pop();
        dfsVisitScope.current = dfsVisitScope.stack_entry.node;
        if (callbacks.node_popped) {
            $CB.execCallbacks(callbacks.node_popped, dfsVisitScope);
        }
        if (!config.dfs_visit_marked[dfsVisitScope.current.getID()]) {
            config.dfs_visit_marked[dfsVisitScope.current.getID()] = true;
            if (callbacks.node_unmarked) {
                $CB.execCallbacks(callbacks.node_unmarked, dfsVisitScope);
            }
            if (dir_mode === $G.GraphMode.MIXED) {
                dfsVisitScope.adj_nodes = dfsVisitScope.current.reachNodes();
            }
            else if (dir_mode === $G.GraphMode.UNDIRECTED) {
                dfsVisitScope.adj_nodes = dfsVisitScope.current.connNodes();
            }
            else if (dir_mode === $G.GraphMode.DIRECTED) {
                dfsVisitScope.adj_nodes = dfsVisitScope.current.nextNodes();
            }
            if (typeof callbacks.sort_nodes === 'function') {
                callbacks.sort_nodes(dfsVisitScope);
            }
            for (var adj_idx in dfsVisitScope.adj_nodes) {
                if (callbacks) {
                }
                dfsVisitScope.stack.push({
                    node: dfsVisitScope.adj_nodes[adj_idx].node,
                    parent: dfsVisitScope.current,
                    weight: dfsVisitScope.adj_nodes[adj_idx].edge.getWeight()
                });
            }
            if (callbacks.adj_nodes_pushed) {
                $CB.execCallbacks(callbacks.adj_nodes_pushed, dfsVisitScope);
            }
        }
        else {
            if (callbacks.node_marked) {
                $CB.execCallbacks(callbacks.node_marked, dfsVisitScope);
            }
        }
    }
    return config.visit_result;
}
exports.DFSVisit = DFSVisit;
function DFS(graph, root, config) {
    var config = config || prepareDFSStandardConfig(), callbacks = config.callbacks, dir_mode = config.dir_mode;
    if (graph.getMode() === $G.GraphMode.INIT) {
        throw new Error('Cowardly refusing to traverse graph without edges.');
    }
    if (dir_mode === $G.GraphMode.INIT) {
        throw new Error('Cannot traverse a graph with dir_mode set to INIT.');
    }
    var dfsScope = {
        marked: {},
        nodes: graph.getNodes()
    };
    if (callbacks.init_dfs) {
        $CB.execCallbacks(callbacks.init_dfs, dfsScope);
    }
    callbacks.adj_nodes_pushed = callbacks.adj_nodes_pushed || [];
    var markNode = function (context) {
        dfsScope.marked[context.current.getID()] = true;
    };
    callbacks.adj_nodes_pushed.push(markNode);
    var dfs_result = [{}];
    var dfs_idx = 0;
    var count = 0;
    var counter = function () {
        return count++;
    };
    var addToProperSegment = function (context) {
        dfs_result[dfs_idx][context.current.getID()] = {
            parent: context.stack_entry.parent,
            counter: counter()
        };
    };
    if (callbacks && callbacks.node_unmarked) {
        callbacks.node_unmarked.push(addToProperSegment);
    }
    DFSVisit(graph, root, config);
    for (var node_key in dfsScope.nodes) {
        if (!dfsScope.marked[node_key]) {
            dfs_idx++;
            dfs_result.push({});
            DFSVisit(graph, dfsScope.nodes[node_key], config);
        }
    }
    return dfs_result;
}
exports.DFS = DFS;
function prepareDFSVisitStandardConfig() {
    var config = {
        visit_result: {},
        callbacks: {},
        messages: {},
        dfs_visit_marked: {},
        dir_mode: $G.GraphMode.MIXED
    }, result = config.visit_result, callbacks = config.callbacks;
    var count = 0;
    var counter = function () {
        return count++;
    };
    callbacks.init_dfs_visit = callbacks.init_dfs_visit || [];
    var initDFSVisit = function (context) {
        result[context.current_root.getID()] = {
            parent: context.current_root
        };
    };
    callbacks.init_dfs_visit.push(initDFSVisit);
    callbacks.node_unmarked = callbacks.node_unmarked || [];
    var setResultEntry = function (context) {
        result[context.current.getID()] = {
            parent: context.stack_entry.parent,
            counter: counter()
        };
    };
    callbacks.node_unmarked.push(setResultEntry);
    return config;
}
exports.prepareDFSVisitStandardConfig = prepareDFSVisitStandardConfig;
function prepareDFSStandardConfig() {
    var config = prepareDFSVisitStandardConfig(), callbacks = config.callbacks, result = config.visit_result;
    callbacks.init_dfs = callbacks.init_dfs || [];
    var setInitialResultEntries = function (context) {
    };
    callbacks.init_dfs.push(setInitialResultEntries);
    return config;
}
exports.prepareDFSStandardConfig = prepareDFSStandardConfig;
;
