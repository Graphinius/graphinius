/// <reference path="../../typings/tsd.d.ts" />
import * as $N from '../core/Nodes';
import * as $G from '../core/Graph';
export interface DFS_Config {
    visit_result: {};
    callbacks: DFS_Callbacks;
    dir_mode: $G.GraphMode;
    dfs_visit_marked: {
        [id: string]: boolean;
    };
    messages?: {};
    filters?: any;
}
export interface DFS_Callbacks {
    init_dfs?: Array<Function>;
    init_dfs_visit?: Array<Function>;
    node_popped?: Array<Function>;
    node_marked?: Array<Function>;
    node_unmarked?: Array<Function>;
    adj_nodes_pushed?: Array<Function>;
    sort_nodes?: Function;
}
export interface StackEntry {
    node: $N.IBaseNode;
    parent: $N.IBaseNode;
    weight?: number;
}
export interface DFSVisit_Scope {
    stack: Array<StackEntry>;
    adj_nodes: Array<$N.NeighborEntry>;
    stack_entry: StackEntry;
    current: $N.IBaseNode;
    current_root: $N.IBaseNode;
}
export interface DFS_Scope {
    marked: {
        [id: string]: boolean;
    };
    nodes: {
        [id: string]: $N.IBaseNode;
    };
}
/**
 * DFS Visit - one run to see what nodes are reachable
 * from a given "current" root node
 *
 * @param graph
 * @param current_root
 * @param config
 * @returns {{}}
 * @constructor
 */
declare function DFSVisit(graph: $G.IGraph, current_root: $N.IBaseNode, config?: DFS_Config): {};
/**
 * Depth first search - used for reachability / exploration
 * of graph structure and as a basis for topological sorting
 * and component / community analysis.
 * Because DFS can be used as a basis for many other algorithms,
 * we want to keep the result as generic as possible to be
 * populated by the caller rather than the core DFS algorithm.
 *
 * @param graph
 * @param root
 * @param config
 * @returns {{}[]}
 * @constructor
 */
declare function DFS(graph: $G.IGraph, root: $N.IBaseNode, config?: DFS_Config): {}[];
/**
 * This is the only place in which a config object
 * is instantiated (except manually, of course)
 *
 * Therefore, we do not take any arguments
 */
declare function prepareDFSVisitStandardConfig(): DFS_Config;
/**
 * First instantiates config file for DFSVisit, then
 * enhances it with outer DFS init callback
 */
declare function prepareDFSStandardConfig(): DFS_Config;
export { DFSVisit, DFS, prepareDFSVisitStandardConfig, prepareDFSStandardConfig };
