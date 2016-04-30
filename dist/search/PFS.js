/// <reference path="../../typings/tsd.d.ts" />
"use strict";
var $E = require('../core/Edges');
var $G = require('../core/Graph');
var $CB = require('../utils/callbackUtils');
var $BH = require('../../src/datastructs/binaryHeap');
/**
 * Priority first search
 *
 * Like BFS, we are not necessarily visiting the
 * whole graph, but only what's reachable from
 * a given start node.
 *
 * @param graph the graph to perform PFS only
 * @param v the node from which to start PFS
 * @config a config object similar to that used
 * in BFS, automatically instantiated if not given..
 */
function PFS(graph, v, config) {
    var config = config || preparePFSStandardConfig(), callbacks = config.callbacks, dir_mode = config.dir_mode;
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
     * we take a standard eval function returning
     * the weight of a successor edge
     * This will later be replaced by a config option...
     */
    var evalPriority = function (ne) {
        return ne.edge.getWeight();
    };
    /**
     * we take a standard ID function returning
     * the ID of a NeighborEntry's node
     * This will later be replaced by a config option...
     */
    var evalObjID = function (ne) {
        return ne.node.getID();
    };
    var scope = {
        OPEN_HEAP: new $BH.BinaryHeap($BH.BinaryHeapMode.MIN, evalPriority, evalObjID),
        OPEN: {},
        CLOSED: {},
        nodes: graph.getNodes(),
        current: null,
        next_node: null,
        next_edge: null,
        root_node: v,
        adj_nodes: []
    };
    /**
       * HOOK 1: PFS INIT
       */
    callbacks.init_pfs && $CB.execCallbacks(callbacks.init_pfs, scope);
    // We need to push NeighborEntries
    // TODO: Virtual edge addition OK?
    var start_ne = {
        node: v,
        edge: new $E.BaseEdge('virtual start edge', v, v, { weighted: true, weight: 0 })
    };
    scope.OPEN_HEAP.insert(start_ne);
    /**
     * Main loop
     */
    while (scope.OPEN_HEAP.size()) {
        scope.current = scope.OPEN_HEAP.pop();
        // TODO what if we already reached the goal?
        if (scope.current.node === config.goal_node) {
            /**
             * HOOK 2: Goal node reached
             */
            config.callbacks.goal_reached && $CB.execCallbacks(config.callbacks.goal_reached);
        }
        /**
             * Do we move only in the directed subgraph,
             * undirected subgraph or complete (mixed) graph?
             */
        if (dir_mode === $G.GraphMode.MIXED) {
            scope.adj_nodes = scope.current.node.adjNodes();
        }
        else if (dir_mode === $G.GraphMode.UNDIRECTED) {
            scope.adj_nodes = scope.current.node.connNodes();
        }
        else if (dir_mode === $G.GraphMode.DIRECTED) {
            scope.adj_nodes = scope.current.node.nextNodes();
        }
        else {
            scope.adj_nodes = [];
        }
        // HACK Replace with actual algorithm:    
        config.callbacks.node_open && $CB.execCallbacks(config.callbacks.node_open);
        config.callbacks.node_closed && $CB.execCallbacks(config.callbacks.node_closed);
        config.callbacks.better_path && $CB.execCallbacks(config.callbacks.better_path);
    }
    return {};
}
exports.PFS = PFS;
function preparePFSStandardConfig() {
    var config = {
        result: {},
        callbacks: {
            init_pfs: [],
            node_open: [],
            node_closed: [],
            better_path: [],
            goal_reached: []
        },
        messages: {
            init_pfs_msgs: [],
            node_open_msgs: [],
            node_closed_msgs: [],
            better_path_msgs: [],
            goal_reached_msgs: []
        },
        dir_mode: $G.GraphMode.MIXED,
        goal_node: null
    }, result = config.result, callbacks = config.callbacks;
    var count = 0;
    var counter = function () {
        return count++;
    };
    // Standard INIT callback
    var initPFS = function (context) {
        // initialize all nodes to infinite distance
        for (var key in context.nodes) {
            config.result[key] = {
                distance: Number.POSITIVE_INFINITY,
                parent: null,
                counter: -1
            };
        }
        // initialize root node entry
        // maybe take heuristic into account right here...??
        config.result[context.root_node.getID()] = {
            distance: 0,
            parent: context.root_node,
            counter: counter()
        };
    };
    callbacks.init_pfs.push(initPFS);
    return config;
}
exports.preparePFSStandardConfig = preparePFSStandardConfig;
