"use strict";
/// <reference path="../../typings/tsd.d.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
const $E = require("../core/Edges");
const $G = require("../core/Graph");
const $CB = require("../utils/callbackUtils");
const $BH = require("../datastructs/binaryHeap");
exports.DEFAULT_WEIGHT = 1;
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
    var config = config || preparePFSStandardConfig(), callbacks = config.callbacks, dir_mode = config.dir_mode, evalPriority = config.evalPriority, evalObjID = config.evalObjID;
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
    // We need to push NeighborEntries
    // TODO: Virtual edge addition OK?
    var start_ne = {
        node: v,
        edge: new $E.BaseEdge('virtual start edge', v, v, { weighted: true, weight: 0 }),
        best: 0
    };
    var scope = {
        OPEN_HEAP: new $BH.BinaryHeap($BH.BinaryHeapMode.MIN, evalPriority, evalObjID),
        OPEN: {},
        CLOSED: {},
        nodes: graph.getNodes(),
        root_node: v,
        current: start_ne,
        adj_nodes: [],
        next: null,
        proposed_dist: Number.POSITIVE_INFINITY,
    };
    /**
       * HOOK 1: PFS INIT
       */
    callbacks.init_pfs && $CB.execCallbacks(callbacks.init_pfs, scope);
    //initializes the result entry, gives the start node the final values, and default values for all others
    scope.OPEN_HEAP.insert(start_ne);
    scope.OPEN[start_ne.node.getID()] = start_ne;
    /**
     * Main loop
     */
    while (scope.OPEN_HEAP.size()) {
        // console.log(scope.OPEN_HEAP); //LOG!
        // get currently best node
        //pop returns the first element of the OPEN_HEAP, which is the node with the smallest distance
        //it removes it from the heap, too - no extra removal needed
        // process.stdout.write(`heap array: [`);
        // scope.OPEN_HEAP.getArray().forEach( ne => {
        //   process.stdout.write( ne.node.getID() + ", " );
        // });
        // console.log(']');
        // console.log(`heap positions: \n`)
        // console.log(scope.OPEN_HEAP.getPositions());
        scope.current = scope.OPEN_HEAP.pop();
        // console.log(`node: ${scope.current.node.getID()}`); //LOG!
        // console.log(`best: ${scope.current.best}`); //LOG!
        /**
         * HOOK 2: NEW CURRENT
         */
        callbacks.new_current && $CB.execCallbacks(callbacks.new_current, scope);
        if (scope.current == null) {
            console.log("HEAP popped undefined - HEAP size: " + scope.OPEN_HEAP.size());
        }
        // remove from OPEN
        scope.OPEN[scope.current.node.getID()] = undefined;
        // add it to CLOSED
        scope.CLOSED[scope.current.node.getID()] = scope.current;
        // TODO what if we already reached the goal?
        if (scope.current.node === config.goal_node) {
            /**
             * HOOK 3: Goal node reached
             */
            config.callbacks.goal_reached && $CB.execCallbacks(config.callbacks.goal_reached, scope);
            // If a goal node is set from the outside & we reach it, we stop.
            return config.result;
        }
        /**
         * Extend the current node, also called
         * "create n's successors"...
             */
        // TODO: Reverse callback logic to NOT merge anything by default!!!
        if (dir_mode === $G.GraphMode.MIXED) {
            scope.adj_nodes = scope.current.node.reachNodes();
        }
        else if (dir_mode === $G.GraphMode.UNDIRECTED) {
            scope.adj_nodes = scope.current.node.connNodes();
        }
        else if (dir_mode === $G.GraphMode.DIRECTED) {
            scope.adj_nodes = scope.current.node.nextNodes();
        }
        else {
            throw new Error('Unsupported traversal mode. Please use directed, undirected, or mixed');
        }
        /**
         * EXPAND AND EXAMINE NEIGHBORHOOD
         */
        for (var adj_idx in scope.adj_nodes) {
            scope.next = scope.adj_nodes[adj_idx];
            // console.log("scopeNext now:"); //LOG!
            // console.log(scope.next.node.getID());
            if (scope.CLOSED[scope.next.node.getID()]) {
                /**
                 * HOOK 4: Goal node already closed
                 */
                config.callbacks.node_closed && $CB.execCallbacks(config.callbacks.node_closed, scope);
                continue;
            }
            if (scope.OPEN[scope.next.node.getID()]) {
                // First let's recover the previous best solution from our OPEN structure,
                // as the node's neighborhood-retrieving function cannot know it...
                // console.log("MARKER - ALREADY OPEN"); //LOG!
                scope.next.best = scope.OPEN[scope.next.node.getID()].best;
                /**
                 * HOOK 5: Goal node already visited, but not yet closed
                 */
                config.callbacks.node_open && $CB.execCallbacks(config.callbacks.node_open, scope);
                scope.proposed_dist = scope.current.best + (isNaN(scope.next.edge.getWeight()) ? exports.DEFAULT_WEIGHT : scope.next.edge.getWeight());
                /**
                 * HOOK 6: Better path found
                 */
                if (scope.next.best > scope.proposed_dist) {
                    config.callbacks.better_path && $CB.execCallbacks(config.callbacks.better_path, scope);
                    // HEAP operations are necessary for internal traversal,
                    // so we handle them here in the main loop
                    //removing thext with the old value and adding it again with updated value
                    scope.OPEN_HEAP.remove(scope.next);
                    // console.log("MARKER - BETTER DISTANCE");
                    // console.log(scope.OPEN_HEAP);
                    scope.next.best = scope.proposed_dist;
                    scope.OPEN_HEAP.insert(scope.next);
                    scope.OPEN[scope.next.node.getID()].best = scope.proposed_dist;
                }
                /**
                 * HOOK 7: Equal path found (same weight)
                 */
                //at the moment, this callback array is empty here in the PFS and in the Dijkstra, but used in the Johnsons
                else if (scope.next.best === scope.proposed_dist) {
                    config.callbacks.equal_path && $CB.execCallbacks(config.callbacks.equal_path, scope);
                }
                continue;
            }
            // NODE NOT ENCOUNTERED
            config.callbacks.not_encountered && $CB.execCallbacks(config.callbacks.not_encountered, scope);
            // HEAP operations are necessary for internal traversal,
            // so we handle them here in the main loop
            scope.OPEN_HEAP.insert(scope.next);
            scope.OPEN[scope.next.node.getID()] = scope.next;
            // console.log("MARKER-NOT ENCOUNTERED"); //LOG!
        }
    }
    return config.result;
}
exports.PFS = PFS;
function preparePFSStandardConfig() {
    var config = {
        result: {},
        callbacks: {
            init_pfs: [],
            new_current: [],
            not_encountered: [],
            node_open: [],
            node_closed: [],
            better_path: [],
            equal_path: [],
            goal_reached: []
        },
        messages: {
            init_pfs_msgs: [],
            new_current_msgs: [],
            not_enc_msgs: [],
            node_open_msgs: [],
            node_closed_msgs: [],
            better_path_msgs: [],
            equal_path_msgs: [],
            goal_reached_msgs: []
        },
        dir_mode: $G.GraphMode.MIXED,
        goal_node: null,
        evalPriority: function (ne) {
            return ne.best || exports.DEFAULT_WEIGHT;
        },
        evalObjID: function (ne) {
            return ne.node.getID();
        }
    }, callbacks = config.callbacks;
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
    // Node not yet encountered callback
    var notEncountered = function (context) {
        // setting it's best score to actual distance + edge weight
        // and update result structure
        context.next.best = context.current.best + (isNaN(context.next.edge.getWeight()) ? exports.DEFAULT_WEIGHT : context.next.edge.getWeight());
        config.result[context.next.node.getID()] = {
            distance: context.next.best,
            parent: context.current.node,
            counter: undefined
        };
    };
    callbacks.not_encountered.push(notEncountered);
    // Callback for when we find a better solution
    var betterPathFound = function (context) {
        config.result[context.next.node.getID()].distance = context.proposed_dist;
        config.result[context.next.node.getID()].parent = context.current.node;
    };
    callbacks.better_path.push(betterPathFound);
    return config;
}
exports.preparePFSStandardConfig = preparePFSStandardConfig;
