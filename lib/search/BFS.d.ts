import * as $N from '../core/BaseNode';
import * as $E from '../core/BaseEdge';
import * as $G from '../core/BaseGraph';
export interface BFS_Config {
    result: {
        [id: string]: BFS_ResultEntry;
    };
    callbacks: BFS_Callbacks;
    dir_mode: $G.GraphMode;
    messages?: {};
    filters?: any;
}
export interface BFS_ResultEntry {
    distance: number;
    parent: $N.IBaseNode;
    counter: number;
}
export interface BFS_Callbacks {
    init_bfs?: Array<Function>;
    node_unmarked?: Array<Function>;
    node_marked?: Array<Function>;
    sort_nodes?: Function;
}
export interface BFS_Scope {
    marked: {
        [id: string]: boolean;
    };
    nodes: {
        [id: string]: $N.IBaseNode;
    };
    queue: Array<$N.IBaseNode>;
    current: $N.IBaseNode;
    next_node: $N.IBaseNode;
    next_edge: $E.IBaseEdge;
    root_node: $N.IBaseNode;
    adj_nodes: Array<$N.NeighborEntry>;
}
declare function BFS(graph: $G.IGraph, v: $N.IBaseNode, config?: BFS_Config): {
    [id: string]: BFS_ResultEntry;
};
declare function prepareBFSStandardConfig(): BFS_Config;
export { BFS, prepareBFSStandardConfig };
