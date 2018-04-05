"use strict";
/// <reference path="../../typings/tsd.d.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
var $G = require("../core/Graph");
var $CB = require("../utils/callbackUtils");
/**
 * Breadth first search - usually performed to see
 * reachability etc. Therefore we do not want 'segments'
 * or 'components' of our graph, but simply one well
 * defined result segment covering the whole graph.
 *
 * @param graph the graph to perform BFS on
 * @param v the vertex to use as a start vertex
 * @param config an optional config object, will be
 * automatically instantiated if not passed by caller
 * @returns {{}}
 * @constructor
 */
function BFS(graph, v, config) {
    var config = config || prepareBFSStandardConfig(), callbacks = config.callbacks, dir_mode = config.dir_mode;
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
    // scope to pass to callbacks at different stages of execution
    var bfsScope = {
        marked: {},
        nodes: graph.getNodes(),
        queue: [],
        current: null,
        next_node: null,
        next_edge: null,
        root_node: v,
        adj_nodes: []
    };
    /**
       * HOOK 1: BFS INIT
       */
    if (callbacks.init_bfs) {
        $CB.execCallbacks(callbacks.init_bfs, bfsScope);
    }
    bfsScope.queue.push(v);
    var i = 0;
    while (i < bfsScope.queue.length) {
        bfsScope.current = bfsScope.queue[i++];
        /**
         * Do we move only in the directed subgraph,
         * undirected subgraph or complete (mixed) graph?
         */
        if (dir_mode === $G.GraphMode.MIXED) {
            bfsScope.adj_nodes = bfsScope.current.reachNodes();
        }
        else if (dir_mode === $G.GraphMode.UNDIRECTED) {
            bfsScope.adj_nodes = bfsScope.current.connNodes();
        }
        else if (dir_mode === $G.GraphMode.DIRECTED) {
            bfsScope.adj_nodes = bfsScope.current.nextNodes();
        }
        else {
            bfsScope.adj_nodes = [];
        }
        /**
         * HOOK 2 - Sort adjacent nodes
         */
        if (typeof callbacks.sort_nodes === 'function') {
            callbacks.sort_nodes(bfsScope);
        }
        for (var adj_idx in bfsScope.adj_nodes) {
            bfsScope.next_node = bfsScope.adj_nodes[adj_idx].node;
            bfsScope.next_edge = bfsScope.adj_nodes[adj_idx].edge;
            /**
             * HOOK 3 - Node unmarked
             */
            if (config.result[bfsScope.next_node.getID()].distance === Number.POSITIVE_INFINITY) {
                if (callbacks.node_unmarked) {
                    $CB.execCallbacks(callbacks.node_unmarked, bfsScope);
                }
            }
            else {
                /**
                 * HOOK 4 - Node marked
                 */
                if (callbacks.node_marked) {
                    $CB.execCallbacks(callbacks.node_marked, bfsScope);
                }
            }
        }
    }
    return config.result;
}
exports.BFS = BFS;
function prepareBFSStandardConfig() {
    var config = {
        result: {},
        callbacks: {
            init_bfs: [],
            node_unmarked: [],
            node_marked: [],
            sort_nodes: undefined
        },
        dir_mode: $G.GraphMode.MIXED,
        messages: {},
        filters: {}
    }, result = config.result, callbacks = config.callbacks;
    var count = 0;
    var counter = function () {
        return count++;
    };
    // Standard INIT callback
    var initBFS = function (context) {
        // initialize all nodes to infinite distance
        for (var key in context.nodes) {
            config.result[key] = {
                distance: Number.POSITIVE_INFINITY,
                parent: null,
                counter: -1
            };
        }
        // initialize root node entry
        config.result[context.root_node.getID()] = {
            distance: 0,
            parent: context.root_node,
            counter: counter()
        };
    };
    callbacks.init_bfs.push(initBFS);
    // Standard Node unmarked callback
    // have to populate respective result entry
    var nodeUnmarked = function (context) {
        config.result[context.next_node.getID()] = {
            distance: result[context.current.getID()].distance + 1,
            parent: context.current,
            counter: counter()
        };
        context.queue.push(context.next_node);
    };
    callbacks.node_unmarked.push(nodeUnmarked);
    return config;
}
exports.prepareBFSStandardConfig = prepareBFSStandardConfig;
