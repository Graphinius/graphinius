/// <reference path="../../typings/tsd.d.ts" />
import * as $N from '../core/Nodes';
import * as $G from '../core/Graph';
import * as $BH from '../datastructs/binaryHeap';
export interface PFS_Config {
    result: {
        [id: string]: PFS_ResultEntry;
    };
    callbacks: PFS_Callbacks;
    dir_mode: $G.GraphMode;
    goal_node: $N.IBaseNode;
    messages?: PFS_Messages;
    filters?: any;
    evalPriority: any;
    evalObjID: any;
}
export interface PFS_ResultEntry {
    distance: number;
    parent: $N.IBaseNode;
    counter: number;
}
export interface PFS_Callbacks {
    init_pfs?: Array<Function>;
    not_encountered?: Array<Function>;
    node_open?: Array<Function>;
    node_closed?: Array<Function>;
    better_path?: Array<Function>;
    goal_reached?: Array<Function>;
}
export interface PFS_Messages {
    init_pfs_msgs?: Array<string>;
    not_enc_msgs?: Array<string>;
    node_open_msgs?: Array<string>;
    node_closed_msgs?: Array<string>;
    better_path_msgs?: Array<string>;
    goal_reached_msgs?: Array<string>;
}
export interface PFS_Scope {
    OPEN_HEAP: $BH.BinaryHeap;
    OPEN: {
        [id: string]: $N.NeighborEntry;
    };
    CLOSED: {
        [id: string]: $N.NeighborEntry;
    };
    nodes: {
        [id: string]: $N.IBaseNode;
    };
    root_node: $N.IBaseNode;
    current: $N.NeighborEntry;
    adj_nodes: Array<$N.NeighborEntry>;
    next: $N.NeighborEntry;
    better_dist: number;
}
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
declare function PFS(graph: $G.IGraph, v: $N.IBaseNode, config?: PFS_Config): {
    [id: string]: PFS_ResultEntry;
};
declare function preparePFSStandardConfig(): PFS_Config;
export { PFS, preparePFSStandardConfig };
