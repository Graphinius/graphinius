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
declare function DFSVisit(graph: $G.IGraph, current_root: $N.IBaseNode, config?: DFS_Config): {};
declare function DFS(graph: $G.IGraph, root: $N.IBaseNode, config?: DFS_Config): {}[];
declare function prepareDFSVisitStandardConfig(): DFS_Config;
declare function prepareDFSStandardConfig(): DFS_Config;
export { DFSVisit, DFS, prepareDFSVisitStandardConfig, prepareDFSStandardConfig };
