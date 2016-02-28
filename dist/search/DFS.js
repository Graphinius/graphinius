/// <reference path="../../typings/tsd.d.ts" />
"use strict";
var $G = require('../core/Graph');
function DFSVisit(graph, current_root, config) {
    var scope = {
        marked_temp: {},
        stack: [],
        adj_nodes: [],
        stack_entry: null,
        current: null,
        current_root: current_root
    };
    var config = config || prepareDFSVisitStandardConfig(), callbacks = config.callbacks, dir_mode = config.dir_mode;
    /**
     * We are not traversing an empty graph...
     */
    if (graph.getMode() === $G.GraphMode.INIT) {
        throw new Error('Cowardly refusing to traverse graph without edges.');
    }
    /**
       * We are not traversing a graph taking NO edges into account
       */
    if (dir_mode === $G.GraphMode.INIT) {
        throw new Error('Cannot traverse a graph with dir_mode set to INIT.');
    }
    /**
     * HOOK 1 - INIT (INNER DFS VISIT):
     * Initializing a possible result object,
     * possibly with the current_root;
     */
    if (callbacks.init_dfs_visit) {
        execCallbacks(callbacks.init_dfs_visit, scope);
    }
    // Start by pushing current root to the stack
    scope.stack.push({
        node: current_root,
        parent: current_root
    });
    while (scope.stack.length) {
        scope.stack_entry = scope.stack.pop();
        scope.current = scope.stack_entry.node;
        /**
         * HOOK 2 - AQUIRED CURRENT NODE / POPPED NODE
         */
        if (callbacks.node_popped) {
            execCallbacks(callbacks.node_popped, scope);
        }
        if (!scope.marked_temp[scope.current.getID()]) {
            scope.marked_temp[scope.current.getID()] = true;
            /**
             * HOOK 3 - CURRENT NODE UNMARKED
             */
            if (callbacks.node_unmarked) {
                execCallbacks(callbacks.node_unmarked, scope);
            }
            /**
             * Do we move only in the directed subgraph,
             * undirected subgraph or complete (mixed) graph?
             */
            if (dir_mode === $G.GraphMode.MIXED) {
                scope.adj_nodes = scope.current.adjNodes();
            }
            else if (dir_mode === $G.GraphMode.UNDIRECTED) {
                scope.adj_nodes = scope.current.connNodes();
            }
            else if (dir_mode === $G.GraphMode.DIRECTED) {
                scope.adj_nodes = scope.current.nextNodes();
            }
            for (var adj_idx in scope.adj_nodes) {
                /**
                 * HOOK 6 - NODE OR EDGE TYPE CHECK...
                 * LATER !!
                 */
                scope.stack.push({
                    node: scope.adj_nodes[adj_idx],
                    parent: scope.current
                });
            }
            /**
             * HOOK 4 - ADJACENT NODES PUSHED - LEAVING CURRENT NODE
             */
            if (callbacks.adj_nodes_pushed) {
                execCallbacks(callbacks.adj_nodes_pushed, scope);
            }
        }
        else {
            /**
             * HOOK 5 - CURRENT NODE ALREADY MARKED
             */
            if (callbacks.node_marked) {
                execCallbacks(callbacks.node_marked, scope);
            }
        }
    }
    return config.result;
}
exports.DFSVisit = DFSVisit;
/**
 * OuterDFS function
 */
function DFS(graph, config) {
    var config = config || prepareDFSStandardConfig(), callbacks = config.callbacks, dir_mode = config.dir_mode;
    if (graph.getMode() === $G.GraphMode.INIT) {
        throw new Error('Cowardly refusing to traverse graph without edges.');
    }
    if (dir_mode === $G.GraphMode.INIT) {
        throw new Error('Cannot traverse a graph with dir_mode set to INIT.');
    }
    var scope = {
        marked: {},
        nodes: graph.getNodes()
    };
    /**
     * HOOK 1 - INIT (OUTER DFS)
     */
    if (callbacks.init_dfs) {
        execCallbacks(callbacks.init_dfs, scope);
    }
    callbacks.adj_nodes_pushed = callbacks.adj_nodes_pushed || [];
    var markNode = function (context) {
        scope.marked[context.current.getID()] = true;
    };
    callbacks.adj_nodes_pushed.push(markNode);
    for (var node_id in scope.nodes) {
        if (!scope.marked[node_id]) {
            DFSVisit(graph, scope.nodes[node_id], config);
        }
    }
    return config.result;
}
exports.DFS = DFS;
/**
 * This is the only place in which a config object
 * is instantiated (except manually, of course)
 *
 * Therefore, we do not take any arguments
 */
function prepareDFSVisitStandardConfig() {
    var config = {
        result: {},
        callbacks: {},
        dir_mode: $G.GraphMode.MIXED
    }, result = config.result, callbacks = config.callbacks;
    // internal variable for order of visit
    // during DFS Visit                      
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
/**
 * First instantiates config file for DFSVisit, then
 * enhances it with outer DFS init callback
 */
function prepareDFSStandardConfig() {
    // First prepare DFS Visit callbacks
    var config = prepareDFSVisitStandardConfig(), callbacks = config.callbacks, result = config.result;
    // Now add outer DFS INIT callback
    callbacks.init_dfs = callbacks.init_dfs || [];
    var setInitialResultEntries = function (context) {
        for (var node_id in context.nodes) {
            result[node_id] = {
                parent: null,
                counter: -1
            };
        }
    };
    callbacks.init_dfs.push(setInitialResultEntries);
    return config;
}
exports.prepareDFSStandardConfig = prepareDFSStandardConfig;
;
/**
 * @param context this pointer to the DFS or DFSVisit function
 */
function execCallbacks(cbs, context) {
    cbs.forEach(function (cb) {
        if (typeof cb === 'function') {
            cb(context);
        }
    });
}
exports.execCallbacks = execCallbacks;
