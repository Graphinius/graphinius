"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const $E = require("../core/Edges");
const $G = require("../core/Graph");
const $CB = require("../utils/callbackUtils");
const $BH = require("../datastructs/binaryHeap");
exports.DEFAULT_WEIGHT = 1;
function PFS(graph, v, config) {
    var config = config || preparePFSStandardConfig(), callbacks = config.callbacks, dir_mode = config.dir_mode, evalPriority = config.evalPriority, evalObjID = config.evalObjID;
    if (graph.getMode() === $G.GraphMode.INIT) {
        throw new Error('Cowardly refusing to traverse graph without edges.');
    }
    if (dir_mode === $G.GraphMode.INIT) {
        throw new Error('Cannot traverse a graph with dir_mode set to INIT.');
    }
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
    callbacks.init_pfs && $CB.execCallbacks(callbacks.init_pfs, scope);
    scope.OPEN_HEAP.insert(start_ne);
    scope.OPEN[start_ne.node.getID()] = start_ne;
    while (scope.OPEN_HEAP.size()) {
        scope.current = scope.OPEN_HEAP.pop();
        callbacks.new_current && $CB.execCallbacks(callbacks.new_current, scope);
        if (scope.current == null) {
            console.log("HEAP popped undefined - HEAP size: " + scope.OPEN_HEAP.size());
        }
        scope.OPEN[scope.current.node.getID()] = undefined;
        scope.CLOSED[scope.current.node.getID()] = scope.current;
        if (scope.current.node === config.goal_node) {
            config.callbacks.goal_reached && $CB.execCallbacks(config.callbacks.goal_reached, scope);
            return config.result;
        }
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
        for (var adj_idx in scope.adj_nodes) {
            scope.next = scope.adj_nodes[adj_idx];
            if (scope.CLOSED[scope.next.node.getID()]) {
                config.callbacks.node_closed && $CB.execCallbacks(config.callbacks.node_closed, scope);
                continue;
            }
            if (scope.OPEN[scope.next.node.getID()]) {
                scope.next.best = scope.OPEN[scope.next.node.getID()].best;
                config.callbacks.node_open && $CB.execCallbacks(config.callbacks.node_open, scope);
                scope.proposed_dist = scope.current.best + (isNaN(scope.next.edge.getWeight()) ? exports.DEFAULT_WEIGHT : scope.next.edge.getWeight());
                if (scope.next.best > scope.proposed_dist) {
                    config.callbacks.better_path && $CB.execCallbacks(config.callbacks.better_path, scope);
                    scope.OPEN_HEAP.remove(scope.next);
                    scope.next.best = scope.proposed_dist;
                    scope.OPEN_HEAP.insert(scope.next);
                    scope.OPEN[scope.next.node.getID()].best = scope.proposed_dist;
                }
                else if (scope.next.best === scope.proposed_dist) {
                    config.callbacks.equal_path && $CB.execCallbacks(config.callbacks.equal_path, scope);
                }
                continue;
            }
            config.callbacks.not_encountered && $CB.execCallbacks(config.callbacks.not_encountered, scope);
            scope.OPEN_HEAP.insert(scope.next);
            scope.OPEN[scope.next.node.getID()] = scope.next;
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
    var initPFS = function (context) {
        for (var key in context.nodes) {
            config.result[key] = {
                distance: Number.POSITIVE_INFINITY,
                parent: null,
                counter: -1
            };
        }
        config.result[context.root_node.getID()] = {
            distance: 0,
            parent: context.root_node,
            counter: counter()
        };
    };
    callbacks.init_pfs.push(initPFS);
    var notEncountered = function (context) {
        context.next.best = context.current.best + (isNaN(context.next.edge.getWeight()) ? exports.DEFAULT_WEIGHT : context.next.edge.getWeight());
        config.result[context.next.node.getID()] = {
            distance: context.next.best,
            parent: context.current.node,
            counter: undefined
        };
    };
    callbacks.not_encountered.push(notEncountered);
    var betterPathFound = function (context) {
        config.result[context.next.node.getID()].distance = context.proposed_dist;
        config.result[context.next.node.getID()].parent = context.current.node;
    };
    callbacks.better_path.push(betterPathFound);
    return config;
}
exports.preparePFSStandardConfig = preparePFSStandardConfig;
