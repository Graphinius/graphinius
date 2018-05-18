declare module 'graphinius/core/Edges' {
	import * as $N from 'graphinius/core/Nodes';
	export interface IConnectedNodes {
	    a: $N.IBaseNode;
	    b: $N.IBaseNode;
	}
	/**
	 * Edges are the most basic components in graphinius.
	 * They control no other elements below them, but hold
	 * references to the nodes they are connecting...
	 * @param _id internal id, public
	 * @param _label edge label, public
	 */
	export interface IBaseEdge {
	    getID(): string;
	    getLabel(): string;
	    setLabel(label: string): void;
	    isDirected(): boolean;
	    isWeighted(): boolean;
	    getWeight(): number;
	    setWeight(w: number): void;
	    getNodes(): IConnectedNodes;
	    clone(node_a: $N.BaseNode, node_b: $N.BaseNode): IBaseEdge;
	}
	export interface EdgeConstructorOptions {
	    directed?: boolean;
	    weighted?: boolean;
	    weight?: number;
	    label?: string;
	} class BaseEdge implements IBaseEdge {
	    protected _id: string;
	    protected _node_a: $N.IBaseNode;
	    protected _node_b: $N.IBaseNode;
	    protected _directed: boolean;
	    protected _weighted: boolean;
	    protected _weight: number;
	    protected _label: string;
	    constructor(_id: string, _node_a: $N.IBaseNode, _node_b: $N.IBaseNode, options?: EdgeConstructorOptions);
	    getID(): string;
	    getLabel(): string;
	    setLabel(label: string): void;
	    isDirected(): boolean;
	    isWeighted(): boolean;
	    getWeight(): number;
	    setWeight(w: number): void;
	    getNodes(): IConnectedNodes;
	    clone(new_node_a: $N.BaseNode, new_node_b: $N.BaseNode): BaseEdge;
	}
	export { BaseEdge };

}
declare module 'graphinius/utils/structUtils' {
	 function clone(obj: any): any; function mergeArrays(args: Array<Array<any>>, cb?: Function): any[]; function mergeObjects(args: Array<Object>): {}; function findKey(obj: Object, cb: Function): string; function mergeOrderedArraysNoDups(a: Array<number>, b: Array<number>): Array<number>;
	export { clone, mergeArrays, mergeOrderedArraysNoDups, mergeObjects, findKey };

}
declare module 'graphinius/core/Nodes' {
	/// <reference path="../../typings/tsd.d.ts" />
	import * as $E from 'graphinius/core/Edges';
	export interface NeighborEntry {
	    node: IBaseNode;
	    edge: $E.IBaseEdge;
	    best?: number;
	}
	export interface IBaseNode {
	    getID(): string;
	    getLabel(): string;
	    setLabel(label: string): void;
	    getFeatures(): {
	        [k: string]: any;
	    };
	    getFeature(key: string): any;
	    setFeatures(features: {
	        [k: string]: any;
	    }): void;
	    setFeature(key: string, value: any): void;
	    deleteFeature(key: string): any;
	    clearFeatures(): void;
	    inDegree(): number;
	    outDegree(): number;
	    degree(): number;
	    addEdge(edge: $E.IBaseEdge): void;
	    hasEdge(edge: $E.IBaseEdge): boolean;
	    hasEdgeID(id: string): boolean;
	    getEdge(id: string): $E.IBaseEdge;
	    inEdges(): {
	        [k: string]: $E.IBaseEdge;
	    };
	    outEdges(): {
	        [k: string]: $E.IBaseEdge;
	    };
	    undEdges(): {
	        [k: string]: $E.IBaseEdge;
	    };
	    dirEdges(): {};
	    allEdges(): {};
	    removeEdge(edge: $E.IBaseEdge): void;
	    removeEdgeID(id: string): void;
	    clearOutEdges(): void;
	    clearInEdges(): void;
	    clearUndEdges(): void;
	    clearEdges(): void;
	    prevNodes(): Array<NeighborEntry>;
	    nextNodes(): Array<NeighborEntry>;
	    connNodes(): Array<NeighborEntry>;
	    reachNodes(identityFunc?: Function): Array<NeighborEntry>;
	    clone(): IBaseNode;
	} class BaseNode implements IBaseNode {
	    protected _id: string;
	    protected _label: string;
	    private _in_degree;
	    private _out_degree;
	    private _und_degree;
	    protected _features: {
	        [k: string]: any;
	    };
	    /**
	     * Design decision:
	     * Do we only use ONE _edges hash - OR -
	     * separate hashes for _in_edges, _out_edges, _und_edges
	     * As getting edges based on their type during the
	     * execution of graph algorithms is pretty common,
	     * it's logical to separate the structures.
	     */
	    protected _in_edges: {
	        [k: string]: $E.IBaseEdge;
	    };
	    protected _out_edges: {
	        [k: string]: $E.IBaseEdge;
	    };
	    protected _und_edges: {
	        [k: string]: $E.IBaseEdge;
	    };
	    constructor(_id: string, features?: {
	        [k: string]: any;
	    });
	    getID(): string;
	    getLabel(): string;
	    setLabel(label: string): void;
	    getFeatures(): {
	        [k: string]: any;
	    };
	    getFeature(key: string): any;
	    setFeatures(features: {
	        [k: string]: any;
	    }): void;
	    setFeature(key: string, value: any): void;
	    deleteFeature(key: string): any;
	    clearFeatures(): void;
	    inDegree(): number;
	    outDegree(): number;
	    degree(): number;
	    /**
	     * We have to:
	     * 1. throw an error if the edge is already attached
	     * 2. add it to the edge array
	     * 3. check type of edge (directed / undirected)
	     * 4. update our degrees accordingly
	     * This is a design decision we can defend by pointing out
	     * that querying degrees will occur much more often
	     * than modifying the edge structure of a node (??)
	     * One further point: do we also check for duplicate
	     * edges not in the sense of duplicate ID's but duplicate
	     * structure (nodes, direction) ?
	     * => Not for now, as we would have to check every edge
	     * instead of simply checking the hash id...
	     * ALTHOUGH: adding edges will (presumably) not occur often...
	     */
	    addEdge(edge: $E.IBaseEdge): void;
	    hasEdge(edge: $E.IBaseEdge): boolean;
	    hasEdgeID(id: string): boolean;
	    getEdge(id: string): $E.IBaseEdge;
	    inEdges(): {
	        [k: string]: $E.IBaseEdge;
	    };
	    outEdges(): {
	        [k: string]: $E.IBaseEdge;
	    };
	    undEdges(): {
	        [k: string]: $E.IBaseEdge;
	    };
	    dirEdges(): {};
	    allEdges(): {};
	    removeEdge(edge: $E.IBaseEdge): void;
	    removeEdgeID(id: string): void;
	    clearOutEdges(): void;
	    clearInEdges(): void;
	    clearUndEdges(): void;
	    clearEdges(): void;
	    prevNodes(): Array<NeighborEntry>;
	    nextNodes(): Array<NeighborEntry>;
	    connNodes(): Array<NeighborEntry>;
	    /**
	     *
	     * @param identityFunc can be used to remove 'duplicates' from resulting array,
	     * if necessary
	     * @returns {Array}
	     *
	   */
	    reachNodes(identityFunc?: Function): Array<NeighborEntry>;
	    clone(): IBaseNode;
	}
	export { BaseNode };

}
declare module 'graphinius/config/run_config' {
	 const LOG_LEVELS: {
	    debug: string;
	    production: string;
	}; const RUN_CONFIG: {
	    log_level: string;
	};
	export { LOG_LEVELS, RUN_CONFIG };

}
declare module 'graphinius/utils/logger' {
	export interface LOG_CONFIG {
	    log_level: string;
	} class Logger {
	    config: LOG_CONFIG;
	    constructor(config?: any);
	    log(msg: any): boolean;
	    error(err: any): boolean;
	    dir(obj: any): boolean;
	    info(msg: any): boolean;
	    warn(msg: any): boolean;
	}
	export { Logger };

}
declare module 'graphinius/utils/callbackUtils' {
	 function execCallbacks(cbs: Array<Function>, context?: any): void;
	export { execCallbacks };

}
declare module 'graphinius/search/BFS' {
	/// <reference path="../../typings/tsd.d.ts" />
	import * as $N from 'graphinius/core/Nodes';
	import * as $E from 'graphinius/core/Edges';
	import * as $G from 'graphinius/core/Graph';
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
	} function BFS(graph: $G.IGraph, v: $N.IBaseNode, config?: BFS_Config): {
	    [id: string]: BFS_ResultEntry;
	}; function prepareBFSStandardConfig(): BFS_Config;
	export { BFS, prepareBFSStandardConfig };

}
declare module 'graphinius/search/DFS' {
	/// <reference path="../../typings/tsd.d.ts" />
	import * as $N from 'graphinius/core/Nodes';
	import * as $G from 'graphinius/core/Graph';
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
	} function DFSVisit(graph: $G.IGraph, current_root: $N.IBaseNode, config?: DFS_Config): {}; function DFS(graph: $G.IGraph, root: $N.IBaseNode, config?: DFS_Config): {}[]; function prepareDFSVisitStandardConfig(): DFS_Config; function prepareDFSStandardConfig(): DFS_Config;
	export { DFSVisit, DFS, prepareDFSVisitStandardConfig, prepareDFSStandardConfig };

}
declare module 'graphinius/datastructs/binaryHeap' {
	/// <reference path="../../typings/tsd.d.ts" />
	export enum BinaryHeapMode {
	    MIN = 0,
	    MAX = 1,
	}
	export interface PositionHeapEntry {
	    score: number;
	    position: number;
	}
	export interface IBinaryHeap {
	    getMode(): BinaryHeapMode;
	    getArray(): Array<any>;
	    size(): number;
	    getEvalPriorityFun(): Function;
	    evalInputScore(obj: any): number;
	    getEvalObjIDFun(): Function;
	    evalInputObjID(obj: any): any;
	    insert(obj: any): void;
	    remove(obj: any): any;
	    peek(): any;
	    pop(): any;
	    find(obj: any): any;
	    getPositions(): any;
	} class BinaryHeap implements IBinaryHeap {
	    private _mode;
	    private _evalPriority;
	    private _evalObjID;
	    _nr_removes: number;
	    private _array;
	    private _positions;
	    /**
	     * Mode of a min heap should only be set upon
	     * instantiation and never again afterwards...
	     * @param _mode MIN or MAX heap
	     * @param _evalObjID function to determine an object's identity
	     * @param _evalPriority function to determine an objects score
	     */
	    constructor(_mode?: BinaryHeapMode, _evalPriority?: (obj: any) => number, _evalObjID?: (obj: any) => any);
	    getMode(): BinaryHeapMode;
	    getArray(): Array<any>;
	    getPositions(): {
	        [id: string]: PositionHeapEntry;
	    };
	    size(): number;
	    getEvalPriorityFun(): Function;
	    evalInputScore(obj: any): number;
	    getEvalObjIDFun(): Function;
	    evalInputObjID(obj: any): any;
	    peek(): any;
	    pop(): any;
	    find(obj: any): any;
	    /**
	     * Insert - Adding an object to the heap
	     * @param obj the obj to add to the heap
	     * @returns {number} the objects index in the internal array
	     */
	    insert(obj: any): void;
	    remove(obj: any): any;
	    private trickleDown(i);
	    private trickleUp(i);
	    private orderCorrect(obj_a, obj_b);
	    /**
	     * Superstructure to enable search in BinHeap in O(1)
	     * @param obj
	     * @param pos
	     */
	    private setNodePosition(obj, pos);
	    /**
	     *
	     */
	    private getNodePosition(obj);
	    /**
	     * @param obj
	     * @returns {number}
	     */
	    private removeNodePosition(obj);
	}
	export { BinaryHeap };

}
declare module 'graphinius/search/PFS' {
	/// <reference path="../../typings/tsd.d.ts" />
	import * as $N from 'graphinius/core/Nodes';
	import * as $G from 'graphinius/core/Graph';
	import * as $BH from 'graphinius/datastructs/binaryHeap';
	export const DEFAULT_WEIGHT: number;
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
	    new_current?: Array<Function>;
	    not_encountered?: Array<Function>;
	    node_open?: Array<Function>;
	    node_closed?: Array<Function>;
	    better_path?: Array<Function>;
	    equal_path?: Array<Function>;
	    goal_reached?: Array<Function>;
	}
	export interface PFS_Messages {
	    init_pfs_msgs?: Array<string>;
	    new_current_msgs?: Array<string>;
	    not_enc_msgs?: Array<string>;
	    node_open_msgs?: Array<string>;
	    node_closed_msgs?: Array<string>;
	    better_path_msgs?: Array<string>;
	    equal_path_msgs?: Array<string>;
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
	    proposed_dist: number;
	} function PFS(graph: $G.IGraph, v: $N.IBaseNode, config?: PFS_Config): {
	    [id: string]: PFS_ResultEntry;
	}; function preparePFSStandardConfig(): PFS_Config;
	export { PFS, preparePFSStandardConfig };

}
declare module 'graphinius/search/BellmanFord' {
	/// <reference path="../../typings/tsd.d.ts" />
	import * as $G from 'graphinius/core/Graph';
	import * as $N from 'graphinius/core/Nodes';
	export interface BFArrrayResult {
	    distances: Array<number>;
	    neg_cycle: boolean;
	}
	export interface BFDictResult {
	    distances: {};
	    neg_cycle: boolean;
	} function BellmanFordArray(graph: $G.IGraph, start: $N.IBaseNode): BFArrrayResult; function BellmanFordDict(graph: $G.IGraph, start: $N.IBaseNode): BFDictResult;
	export { BellmanFordDict, BellmanFordArray };

}
declare module 'graphinius/core/Graph' {
	/// <reference path="../../typings/tsd.d.ts" />
	import * as $N from 'graphinius/core/Nodes';
	import * as $E from 'graphinius/core/Edges';
	export enum GraphMode {
	    INIT = 0,
	    DIRECTED = 1,
	    UNDIRECTED = 2,
	    MIXED = 3,
	}
	export interface GraphStats {
	    mode: GraphMode;
	    nr_nodes: number;
	    nr_und_edges: number;
	    nr_dir_edges: number;
	    density_dir: number;
	    density_und: number;
	}
	/**
	 * Only gives the best distance to a node in case of multiple direct edges
	 */
	export type MinAdjacencyListDict = {
	    [id: string]: MinAdjacencyListDictEntry;
	};
	export type MinAdjacencyListDictEntry = {
	    [id: string]: number;
	};
	export type MinAdjacencyListArray = Array<Array<number>>;
	export type NextArray = Array<Array<Array<number>>>;
	export interface IGraph {
	    _label: string;
	    getMode(): GraphMode;
	    getStats(): GraphStats;
	    addNodeByID(id: string, opts?: {}): $N.IBaseNode;
	    addNode(node: $N.IBaseNode): boolean;
	    cloneAndAddNode(node: $N.IBaseNode): $N.IBaseNode;
	    hasNodeID(id: string): boolean;
	    getNodeById(id: string): $N.IBaseNode;
	    getNodes(): {
	        [key: string]: $N.IBaseNode;
	    };
	    nrNodes(): number;
	    getRandomNode(): $N.IBaseNode;
	    deleteNode(node: any): void;
	    addEdgeByID(label: string, node_a: $N.IBaseNode, node_b: $N.IBaseNode, opts?: {}): $E.IBaseEdge;
	    addEdge(edge: $E.IBaseEdge): $E.IBaseEdge;
	    addEdgeByNodeIDs(label: string, node_a_id: string, node_b_id: string, opts?: {}): $E.IBaseEdge;
	    hasEdgeID(id: string): boolean;
	    getEdgeById(id: string): $E.IBaseEdge;
	    getDirEdgeByNodeIDs(node_a_id: string, node_b_id: string): $E.IBaseEdge;
	    getUndEdgeByNodeIDs(node_a_id: string, node_b_id: string): $E.IBaseEdge;
	    getDirEdges(): {
	        [key: string]: $E.IBaseEdge;
	    };
	    getUndEdges(): {
	        [key: string]: $E.IBaseEdge;
	    };
	    getDirEdgesArray(): Array<$E.IBaseEdge>;
	    getUndEdgesArray(): Array<$E.IBaseEdge>;
	    nrDirEdges(): number;
	    nrUndEdges(): number;
	    deleteEdge(edge: $E.IBaseEdge): void;
	    getRandomDirEdge(): $E.IBaseEdge;
	    getRandomUndEdge(): $E.IBaseEdge;
	    hasNegativeEdge(): boolean;
	    hasNegativeCycles(node?: $N.IBaseNode): boolean;
	    toDirectedGraph(copy?: any): IGraph;
	    toUndirectedGraph(): IGraph;
	    pickRandomProperty(propList: any): any;
	    pickRandomProperties(propList: any, amount: any): Array<string>;
	    deleteInEdgesOf(node: $N.IBaseNode): void;
	    deleteOutEdgesOf(node: $N.IBaseNode): void;
	    deleteDirEdgesOf(node: $N.IBaseNode): void;
	    deleteUndEdgesOf(node: $N.IBaseNode): void;
	    deleteAllEdgesOf(node: $N.IBaseNode): void;
	    clearAllDirEdges(): void;
	    clearAllUndEdges(): void;
	    clearAllEdges(): void;
	    clone(): IGraph;
	    cloneSubGraph(start: $N.IBaseNode, cutoff: Number): IGraph;
	    adjListDict(incoming?: boolean, include_self?: any, self_dist?: number): MinAdjacencyListDict;
	    adjListArray(incoming?: boolean): MinAdjacencyListArray;
	    nextArray(incoming?: boolean): NextArray;
	} class BaseGraph implements IGraph {
	    _label: any;
	    private _nr_nodes;
	    private _nr_dir_edges;
	    private _nr_und_edges;
	    protected _mode: GraphMode;
	    protected _nodes: {
	        [key: string]: $N.IBaseNode;
	    };
	    protected _dir_edges: {
	        [key: string]: $E.IBaseEdge;
	    };
	    protected _und_edges: {
	        [key: string]: $E.IBaseEdge;
	    };
	    constructor(_label: any);
	    /**
	     * Version 1: do it in-place (to the object you receive)
	     * Version 2: clone the graph first, return the mutated clone
	     */
	    toDirectedGraph(copy?: boolean): IGraph;
	    toUndirectedGraph(): IGraph;
	    /**
	     * what to do if some edges are not weighted at all?
	     * Since graph traversal algortihms (and later maybe graphs themselves)
	     * use default weights anyways, I am simply ignoring them for now...
	     * @todo figure out how to test this...
	     */
	    hasNegativeEdge(): boolean;
	    /**
	     * Do we want to throw an error if an edge is unweighted?
	     * Or shall we let the traversal algorithm deal with DEFAULT weights like now?
	     */
	    hasNegativeCycles(node?: $N.IBaseNode): boolean;
	    /**
	     *
	     * @param incoming
	     */
	    nextArray(incoming?: boolean): NextArray;
	    /**
	     * This function iterates over the adjDict in order to use it's advantage
	     * of being able to override edges if edges with smaller weights exist
	     *
	     * However, the order of nodes in the array represents the order of nodes
	     * at creation time, no other implicit alphabetical or collational sorting.
	     *
	     * This has to be considered when further processing the result
	     *
	     * @param incoming whether or not to consider incoming edges as well
	     * @param include_self contains a distance to itself apart?
	     * @param self_dist default distance to self
	     */
	    adjListArray(incoming?: boolean): MinAdjacencyListArray;
	    /**
	     *
	     * @param incoming whether or not to consider incoming edges as well
	     * @param include_self contains a distance to itself apart?
	     * @param self_dist default distance to self
	     */
	    adjListDict(incoming?: boolean, include_self?: boolean, self_dist?: number): MinAdjacencyListDict;
	    getMode(): GraphMode;
	    getStats(): GraphStats;
	    nrNodes(): number;
	    nrDirEdges(): number;
	    nrUndEdges(): number;
	    /**
	     *
	     * @param id
	     * @param opts
	     *
	     * @todo addNode functions should check if a node with a given ID already exists -> node IDs have to be unique...
	     */
	    addNodeByID(id: string, opts?: {}): $N.IBaseNode;
	    addNode(node: $N.IBaseNode): boolean;
	    /**
	     * Instantiates a new node object, copies the features and
	     * adds the node to the graph, but does NOT clone it's edges
	     * @param node the node object to clone
	     */
	    cloneAndAddNode(node: $N.IBaseNode): $N.IBaseNode;
	    hasNodeID(id: string): boolean;
	    getNodeById(id: string): $N.IBaseNode;
	    getNodes(): {
	        [key: string]: $N.IBaseNode;
	    };
	    /**
	     * CAUTION - This function takes linear time in # nodes
	     */
	    getRandomNode(): $N.IBaseNode;
	    deleteNode(node: any): void;
	    hasEdgeID(id: string): boolean;
	    getEdgeById(id: string): $E.IBaseEdge;
	    private checkExistanceOfEdgeNodes(node_a, node_b);
	    getDirEdgeByNodeIDs(node_a_id: string, node_b_id: string): $E.IBaseEdge;
	    getUndEdgeByNodeIDs(node_a_id: string, node_b_id: string): $E.IBaseEdge;
	    getDirEdges(): {
	        [key: string]: $E.IBaseEdge;
	    };
	    getUndEdges(): {
	        [key: string]: $E.IBaseEdge;
	    };
	    getDirEdgesArray(): Array<$E.IBaseEdge>;
	    getUndEdgesArray(): Array<$E.IBaseEdge>;
	    addEdgeByNodeIDs(label: string, node_a_id: string, node_b_id: string, opts?: {}): $E.IBaseEdge;
	    /**
	     * Now all test cases pertaining addEdge() call this one...
	     */
	    addEdgeByID(id: string, node_a: $N.IBaseNode, node_b: $N.IBaseNode, opts?: $E.EdgeConstructorOptions): $E.IBaseEdge;
	    /**
	     * Test cases should be reversed / completed
	     */
	    addEdge(edge: $E.IBaseEdge): $E.IBaseEdge;
	    deleteEdge(edge: $E.IBaseEdge): void;
	    deleteInEdgesOf(node: $N.IBaseNode): void;
	    deleteOutEdgesOf(node: $N.IBaseNode): void;
	    deleteDirEdgesOf(node: $N.IBaseNode): void;
	    deleteUndEdgesOf(node: $N.IBaseNode): void;
	    deleteAllEdgesOf(node: $N.IBaseNode): void;
	    /**
	     * Remove all the (un)directed edges in the graph
	     */
	    clearAllDirEdges(): void;
	    clearAllUndEdges(): void;
	    clearAllEdges(): void;
	    /**
	     * CAUTION - This function is linear in # directed edges
	     */
	    getRandomDirEdge(): $E.IBaseEdge;
	    /**
	     * CAUTION - This function is linear in # undirected edges
	     */
	    getRandomUndEdge(): $E.IBaseEdge;
	    clone(): IGraph;
	    cloneSubGraph(root: $N.IBaseNode, cutoff: Number): IGraph;
	    protected checkConnectedNodeOrThrow(node: $N.IBaseNode): void;
	    protected updateGraphMode(): void;
	    pickRandomProperty(propList: any): any;
	    /**
	     * In some cases we need to give back a large number of objects
	     * in one swoop, as calls to Object.keys() are really slow
	     * for large input objects.
	     *
	     * In order to do this, we only extract the keys once and then
	     * iterate over the key list and add them to a result array
	     * with probability = amount / keys.length
	     *
	     * We also mark all used keys in case we haven't picked up
	     * enough entities for the result array after the first round.
	     * We then just fill up the rest of the result array linearly
	     * with as many unused keys as necessary
	     *
	     *
	     * @todo include generic Test Cases
	     * @todo check if amount is larger than propList size
	     * @todo This seems like a simple hack - filling up remaining objects
	     * Could be replaced by a better fraction-increasing function above...
	     *
	     * @param propList
	     * @param fraction
	     * @returns {Array}
	     */
	    pickRandomProperties(propList: any, amount: any): Array<string>;
	}
	export { BaseGraph };

}
declare module 'graphinius/search/FloydWarshall' {
	/// <reference path="../../typings/tsd.d.ts" />
	import * as $G from 'graphinius/core/Graph'; function FloydWarshallAPSP(graph: $G.IGraph): {}; function FloydWarshallArray(graph: $G.IGraph): $G.MinAdjacencyListArray; function FloydWarshallDict(graph: $G.IGraph): {}; function changeNextToDirectParents(input: $G.NextArray): $G.NextArray;
	export { FloydWarshallAPSP, FloydWarshallArray, FloydWarshallDict, changeNextToDirectParents };

}
declare module 'graphinius/search/Dijkstra' {
	/// <reference path="../../typings/tsd.d.ts" />
	import * as $N from 'graphinius/core/Nodes';
	import * as $G from 'graphinius/core/Graph';
	import * as $PFS from 'graphinius/search/PFS'; function Dijkstra(graph: $G.IGraph, source: $N.IBaseNode, target?: $N.IBaseNode): {
	    [id: string]: $PFS.PFS_ResultEntry;
	};
	export { Dijkstra };

}
declare module 'graphinius/search/Johnsons' {
	/// <reference path="../../typings/tsd.d.ts" />
	import * as $N from 'graphinius/core/Nodes';
	import * as $G from 'graphinius/core/Graph'; function Johnsons(graph: $G.IGraph): {}; function addExtraNandE(target: $G.IGraph, nodeToAdd: $N.IBaseNode): $G.IGraph; function reWeighGraph(target: $G.IGraph, distDict: {}, tempNode: $N.IBaseNode): $G.IGraph; function PFSFromAllNodes(graph: $G.IGraph): {};
	export { Johnsons, addExtraNandE, reWeighGraph, PFSFromAllNodes };

}
declare module 'graphinius/centralities/Betweenness' {
	/// <reference path="../../typings/tsd.d.ts" />
	import * as $G from 'graphinius/core/Graph'; function betweennessCentrality(graph: $G.IGraph, directed: boolean, sparse?: boolean): {};
	export { betweennessCentrality };

}
declare module 'graphinius/centralities/Brandes' {
	/// <reference path="../../typings/tsd.d.ts" />
	/**
	 * Previous version created by ru on 14.09.17 is to be found below.
	 * Modifications by Rita on 28.02.2018 - now it can handle branchings too.
	 * CONTENTS:
	 * Brandes: according to Brandes 2001, it is meant for unweighted graphs (+undirected according to the paper, but runs fine on directed ones, too)
	 * BrandesForWeighted: according to Brandes 2007, handles WEIGHTED graphs, including graphs with null edges
	 * PFSdictBased: an alternative for our PFS, not heap based but dictionary based, however, not faster (see BetweennessTests)
	 */
	import * as $G from 'graphinius/core/Graph'; function BrandesUnweighted(graph: $G.IGraph, normalize?: boolean, directed?: boolean): {};
	export interface BrandesHeapEntry {
	    id: string;
	    best: number;
	} function BrandesWeighted(graph: $G.IGraph, normalize: boolean, directed: boolean): {}; function BrandesPFSbased(graph: $G.IGraph, normalize: boolean, directed: boolean): {}; function normalizeScores(CB: any, N: any, directed: any): void;
	export { BrandesUnweighted, BrandesWeighted, BrandesPFSbased, normalizeScores };

}
declare module 'graphinius/centralities/Closeness' {
	/// <reference path="../../typings/tsd.d.ts" />
	import * as $G from 'graphinius/core/Graph'; class closenessCentrality {
	    getCentralityMapFW(graph: $G.IGraph): Array<Number>;
	    getCentralityMap(graph: $G.IGraph): {
	        [id: string]: number;
	    };
	}
	export { closenessCentrality };

}
declare module 'graphinius/centralities/Degree' {
	/// <reference path="../../typings/tsd.d.ts" />
	import * as $G from 'graphinius/core/Graph';
	export enum DegreeMode {
	    in = 0,
	    out = 1,
	    und = 2,
	    dir = 3,
	    all = 4,
	}
	/**
	 * @TODO per edge type ???
	 */
	export interface DegreeDistribution {
	    in: Uint32Array;
	    out: Uint32Array;
	    dir: Uint32Array;
	    und: Uint32Array;
	    all: Uint32Array;
	} class DegreeCentrality {
	    getCentralityMap(graph: $G.IGraph, weighted?: boolean, conf?: DegreeMode): {
	        [id: string]: number;
	    };
	    /**
	     * @TODO Weighted version !
	   * @TODO per edge type !
	     */
	    degreeDistribution(graph: $G.IGraph): DegreeDistribution;
	}
	export { DegreeCentrality };

}
declare module 'graphinius/centralities/gauss' {
	 function gauss(A: any[], x: any[]): any[];
	export { gauss };

}
declare module 'graphinius/centralities/PageRankGaussian' {
	/// <reference path="../../typings/tsd.d.ts" />
	import * as $G from 'graphinius/core/Graph'; class pageRankDetCentrality {
	    getCentralityMap(graph: $G.IGraph, weighted?: boolean): {
	        [id: string]: number;
	    };
	}
	export { pageRankDetCentrality };

}
declare module 'graphinius/centralities/PageRankRandomWalk' {
	/// <reference path="../../typings/tsd.d.ts" />
	import * as $G from 'graphinius/core/Graph'; class pageRankCentrality {
	    getCentralityMap(graph: $G.IGraph, weighted?: boolean, alpha?: number, conv?: number, iterations?: number): {
	        [id: string]: number;
	    };
	}
	export { pageRankCentrality };

}
/// <reference path="../../typings/tsd.d.ts" />
declare module 'graphinius/mincutmaxflow/minCutMaxFlowBoykov' {
	/// <reference path="../../typings/tsd.d.ts" />
	import * as $N from 'graphinius/core/Nodes';
	import * as $E from 'graphinius/core/Edges';
	import * as $G from 'graphinius/core/Graph';
	export interface MCMFConfig {
	    directed: boolean;
	}
	export interface MCMFResult {
	    edges: Array<$E.IBaseEdge>;
	    edgeIDs: Array<string>;
	    cost: number;
	}
	export interface IMCMFBoykov {
	    calculateCycle(): MCMFResult;
	    convertToDirectedGraph(graph: $G.IGraph): $G.IGraph;
	    prepareMCMFStandardConfig(): MCMFConfig;
	}
	export interface MCMFState {
	    residGraph: $G.IGraph;
	    activeNodes: {
	        [key: string]: $N.IBaseNode;
	    };
	    orphans: {
	        [key: string]: $N.IBaseNode;
	    };
	    treeS: {
	        [key: string]: $N.IBaseNode;
	    };
	    treeT: {
	        [key: string]: $N.IBaseNode;
	    };
	    parents: {
	        [key: string]: $N.IBaseNode;
	    };
	    path: Array<$N.IBaseNode>;
	    tree: {
	        [key: string]: string;
	    };
	} class MCMFBoykov implements IMCMFBoykov {
	    private _graph;
	    private _source;
	    private _sink;
	    private _config;
	    private _state;
	    constructor(_graph: $G.IGraph, _source: $N.IBaseNode, _sink: $N.IBaseNode, config?: MCMFConfig);
	    calculateCycle(): MCMFResult;
	    renameEdges(graph: $G.IGraph): void;
	    convertToDirectedGraph(uGraph: $G.IGraph): $G.IGraph;
	    tree(node: $N.IBaseNode): string;
	    getPathToRoot(node: $N.IBaseNode): $N.IBaseNode[];
	    getBottleneckCapacity(): number;
	    grow(): void;
	    augmentation(): void;
	    adoption(): void;
	    prepareMCMFStandardConfig(): MCMFConfig;
	}
	export { MCMFBoykov };

}
declare module 'graphinius/energyminimization/expansionBoykov' {
	/// <reference path="../../typings/tsd.d.ts" />
	import * as $N from 'graphinius/core/Nodes';
	import * as $G from 'graphinius/core/Graph';
	import * as $MC from 'graphinius/mincutmaxflow/minCutMaxFlowBoykov';
	export type EnergyFunctionTerm = (arg1: string, arg2: string) => number;
	export interface EMEConfig {
	    directed: boolean;
	    labeled: boolean;
	    interactionTerm: EnergyFunctionTerm;
	    dataTerm: EnergyFunctionTerm;
	}
	export interface EMEResult {
	    graph: $G.IGraph;
	}
	export interface IEMEBoykov {
	    calculateCycle(): EMEResult;
	    constructGraph(): $G.IGraph;
	    deepCopyGraph(graph: $G.IGraph): $G.IGraph;
	    initGraph(graph: $G.IGraph): $G.IGraph;
	    prepareEMEStandardConfig(): EMEConfig;
	}
	export interface EMEState {
	    expansionGraph: $G.IGraph;
	    labeledGraph: $G.IGraph;
	    activeLabel: string;
	    energy: number;
	} class EMEBoykov implements IEMEBoykov {
	    private _graph;
	    private _labels;
	    private _config;
	    private _state;
	    private _interactionTerm;
	    private _dataTerm;
	    constructor(_graph: $G.IGraph, _labels: Array<string>, config?: EMEConfig);
	    calculateCycle(): EMEResult;
	    constructGraph(): $G.IGraph;
	    labelGraph(mincut: $MC.MCMFResult, source: $N.IBaseNode): $G.IGraph;
	    deepCopyGraph(graph: $G.IGraph): $G.IGraph;
	    initGraph(graph: $G.IGraph): $G.IGraph;
	    prepareEMEStandardConfig(): EMEConfig;
	}
	export { EMEBoykov };

}
declare module 'graphinius/generators/kroneckerLeskovec' {
	/// <reference path="../../typings/tsd.d.ts" />
	import * as $G from 'graphinius/core/Graph';
	export interface KROLConfig {
	    genMat: Array<Array<number>>;
	    cycles: number;
	}
	export interface KROLResult {
	    graph: $G.IGraph;
	}
	export interface IKROL {
	    generate(): KROLResult;
	    prepareKROLStandardConfig(): KROLConfig;
	} class KROL implements IKROL {
	    private _config;
	    private _genMat;
	    private _cycles;
	    private _graph;
	    constructor(config?: KROLConfig);
	    generate(): KROLResult;
	    addEdge(node1: number, node2: number, dims: number): boolean;
	    prepareKROLStandardConfig(): KROLConfig;
	}
	export { KROL };

}
declare module 'graphinius/utils/remoteUtils' {
	/// <reference types="node" />
	import * as http from 'http';
	export interface RequestConfig {
	    remote_host: string;
	    remote_path: string;
	    file_name: string;
	} function retrieveRemoteFile(config: RequestConfig, cb: Function): http.ClientRequest;
	export { retrieveRemoteFile };

}
declare module 'graphinius/io/input/CSVInput' {
	/// <reference path="../../../typings/tsd.d.ts" />
	import * as $G from 'graphinius/core/Graph';
	import * as $R from 'graphinius/utils/remoteUtils';
	export interface ICSVInput {
	    _separator: string;
	    _explicit_direction: boolean;
	    _direction_mode: boolean;
	    _weighted: boolean;
	    readFromAdjacencyListFile(filepath: string): $G.IGraph;
	    readFromAdjacencyList(input: Array<string>, graph_name: string): $G.IGraph;
	    readFromAdjacencyListURL(config: $R.RequestConfig, cb: Function): any;
	    readFromEdgeListFile(filepath: string): $G.IGraph;
	    readFromEdgeList(input: Array<string>, graph_name: string): $G.IGraph;
	    readFromEdgeListURL(config: $R.RequestConfig, cb: Function): any;
	} class CSVInput implements ICSVInput {
	    _separator: string;
	    _explicit_direction: boolean;
	    _direction_mode: boolean;
	    _weighted: boolean;
	    constructor(_separator?: string, _explicit_direction?: boolean, _direction_mode?: boolean, _weighted?: boolean);
	    readFromAdjacencyListURL(config: $R.RequestConfig, cb: Function): void;
	    readFromEdgeListURL(config: $R.RequestConfig, cb: Function): void;
	    private readGraphFromURL(config, cb, localFun);
	    readFromAdjacencyListFile(filepath: string): $G.IGraph;
	    readFromEdgeListFile(filepath: string): $G.IGraph;
	    private readFileAndReturn(filepath, func);
	    readFromAdjacencyList(input: Array<string>, graph_name: string): $G.IGraph;
	    readFromEdgeList(input: Array<string>, graph_name: string, weighted?: boolean): $G.IGraph;
	    private checkNodeEnvironment();
	}
	export { CSVInput };

}
declare module 'graphinius/io/input/JSONInput' {
	/// <reference path="../../../typings/tsd.d.ts" />
	import * as $G from 'graphinius/core/Graph';
	import * as $R from 'graphinius/utils/remoteUtils';
	export interface JSONEdge {
	    to: string;
	    directed?: string;
	    weight?: string;
	    type?: string;
	}
	export interface JSONNode {
	    edges: Array<JSONEdge>;
	    coords?: {
	        [key: string]: Number;
	    };
	    features?: {
	        [key: string]: any;
	    };
	}
	export interface JSONGraph {
	    name: string;
	    nodes: number;
	    edges: number;
	    data: {
	        [key: string]: JSONNode;
	    };
	}
	export interface IJSONInput {
	    _explicit_direction: boolean;
	    _direction: boolean;
	    _weighted_mode: boolean;
	    readFromJSONFile(file: string): $G.IGraph;
	    readFromJSON(json: {}): $G.IGraph;
	    readFromJSONURL(config: $R.RequestConfig, cb: Function): void;
	} class JSONInput implements IJSONInput {
	    _explicit_direction: boolean;
	    _direction: boolean;
	    _weighted_mode: boolean;
	    constructor(_explicit_direction?: boolean, _direction?: boolean, _weighted_mode?: boolean);
	    readFromJSONFile(filepath: string): $G.IGraph;
	    readFromJSONURL(config: $R.RequestConfig, cb: Function): void;
	    /**
	     * In this case, there is one great difference to the CSV edge list cases:
	     * If you don't explicitly define a directed edge, it will simply
	     * instantiate an undirected one
	     * we'll leave that for now, as we will produce apt JSON sources later anyways...
	     */
	    readFromJSON(json: JSONGraph): $G.IGraph;
	    /**
	     * Infinity & -Infinity cases are redundant, as JavaScript
	     * handles them correctly anyways (for now)
	     * @param edge_input
	     */
	    private handleEdgeWeights(edge_input);
	    private checkNodeEnvironment();
	}
	export { JSONInput };

}
declare module 'graphinius/io/output/CSVOutput' {
	/// <reference path="../../../typings/tsd.d.ts" />
	import * as $G from 'graphinius/core/Graph';
	export interface ICSVOutput {
	    _separator: string;
	    _explicit_direction: boolean;
	    _direction_mode: boolean;
	    writeToAdjacencyListFile(filepath: string, graph: $G.IGraph): void;
	    writeToAdjacencyList(graph: $G.IGraph): string;
	    writeToEdgeListFile(filepath: string, graph: $G.IGraph): void;
	    writeToEdgeList(graph: $G.IGraph): string;
	} class CSVOutput implements ICSVOutput {
	    _separator: string;
	    _explicit_direction: boolean;
	    _direction_mode: boolean;
	    constructor(_separator?: string, _explicit_direction?: boolean, _direction_mode?: boolean);
	    writeToAdjacencyListFile(filepath: string, graph: $G.IGraph): void;
	    writeToAdjacencyList(graph: $G.IGraph): string;
	    writeToEdgeListFile(filepath: string, graph: $G.IGraph): void;
	    writeToEdgeList(graph: $G.IGraph): string;
	}
	export { CSVOutput };

}
declare module 'graphinius/io/output/JSONOutput' {
	/// <reference path="../../../typings/tsd.d.ts" />
	import * as $G from 'graphinius/core/Graph';
	export interface IJSONOutput {
	    writeToJSONFile(filepath: string, graph: $G.IGraph): void;
	    writeToJSONSString(graph: $G.IGraph): string;
	} class JSONOutput implements IJSONOutput {
	    constructor();
	    writeToJSONFile(filepath: string, graph: $G.IGraph): void;
	    writeToJSONSString(graph: $G.IGraph): string;
	    private handleEdgeWeight(edge);
	}
	export { JSONOutput };

}
declare module 'graphinius/perturbation/SimplePerturbations' {
	/// <reference path="../../typings/tsd.d.ts" />
	import * as $N from 'graphinius/core/Nodes';
	import * as $E from 'graphinius/core/Edges';
	import * as $G from 'graphinius/core/Graph';
	/**
	 * EITHER generate new edges via specified degree span
	 * OR via probability of edge creation from a specified
	 * set of nodes to all others
	 */
	export interface NodeDegreeConfiguration {
	    und_degree?: number;
	    dir_degree?: number;
	    min_und_degree?: number;
	    max_und_degree?: number;
	    min_dir_degree?: number;
	    max_dir_degree?: number;
	    probability_dir?: number;
	    probability_und?: number;
	}
	export interface ISimplePerturber {
	    createRandomEdgesProb(probability: number, directed?: boolean, setOfNodes?: {
	        [key: string]: $N.IBaseNode;
	    }): void;
	    createRandomEdgesSpan(min: number, max: number, directed?: boolean, setOfNodes?: {
	        [key: string]: $N.IBaseNode;
	    }): void;
	    randomlyDeleteNodesPercentage(percentage: number): void;
	    randomlyDeleteUndEdgesPercentage(percentage: number): void;
	    randomlyDeleteDirEdgesPercentage(percentage: number): void;
	    randomlyDeleteNodesAmount(amount: number): void;
	    randomlyDeleteUndEdgesAmount(amount: number): void;
	    randomlyDeleteDirEdgesAmount(amount: number): void;
	    randomlyAddNodesPercentage(percentage: number, config?: NodeDegreeConfiguration): void;
	    randomlyAddUndEdgesPercentage(percentage: number): void;
	    randomlyAddDirEdgesPercentage(percentage: number): void;
	    randomlyAddNodesAmount(amount: number, config?: NodeDegreeConfiguration): void;
	    randomlyAddEdgesAmount(amount: number, config?: $E.EdgeConstructorOptions): void;
	} class SimplePerturber implements ISimplePerturber {
	    private _graph;
	    constructor(_graph: $G.IGraph);
	    /**
	     *
	     * @param percentage
	     */
	    randomlyDeleteNodesPercentage(percentage: number): void;
	    /**
	     *
	     * @param percentage
	     */
	    randomlyDeleteUndEdgesPercentage(percentage: number): void;
	    /**
	     *
	     * @param percentage
	     */
	    randomlyDeleteDirEdgesPercentage(percentage: number): void;
	    /**
	     *
	     */
	    randomlyDeleteNodesAmount(amount: number): void;
	    /**
	     *
	     */
	    randomlyDeleteUndEdgesAmount(amount: number): void;
	    /**
	     *
	     */
	    randomlyDeleteDirEdgesAmount(amount: number): void;
	    /**
	     *
	     */
	    randomlyAddUndEdgesPercentage(percentage: number): void;
	    /**
	     *
	     */
	    randomlyAddDirEdgesPercentage(percentage: number): void;
	    /**
	     *
	     * DEFAULT edge direction: UNDIRECTED
	     */
	    randomlyAddEdgesAmount(amount: number, config?: $E.EdgeConstructorOptions): void;
	    /**
	     *
	     */
	    randomlyAddNodesPercentage(percentage: number, config?: NodeDegreeConfiguration): void;
	    /**
	     *
	     * If the degree configuration is invalid
	     * (negative or infinite degree amount / percentage)
	     * the nodes will have been created nevertheless
	     */
	    randomlyAddNodesAmount(amount: number, config?: NodeDegreeConfiguration): void;
	    /**
	     * Go through the degree_configuration provided and create edges
	     * as requested by config
	     */
	    private createEdgesByConfig(config, new_nodes);
	    /**
	     * Simple edge generator:
	     * Go through all node combinations, and
	     * add an (un)directed edge with
	     * @param probability and
	     * @direction true or false
	     * CAUTION: this algorithm takes quadratic runtime in #nodes
	     */
	    createRandomEdgesProb(probability: number, directed?: boolean, new_nodes?: {
	        [key: string]: $N.IBaseNode;
	    }): void;
	    /**
	     * Simple edge generator:
	     * Go through all nodes, and
	     * add [min, max] (un)directed edges to
	     * a randomly chosen node
	     * CAUTION: this algorithm could take quadratic runtime in #nodes
	     * but should be much faster
	     */
	    createRandomEdgesSpan(min: number, max: number, directed?: boolean, setOfNodes?: {
	        [key: string]: $N.IBaseNode;
	    }): void;
	}
	export { SimplePerturber };

}
declare module 'graphinius/utils/genRandomWeights' {
	export {};

}
