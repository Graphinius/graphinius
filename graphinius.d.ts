declare module 'graphinius/config/run_config' {
	 const GENERIC_TYPES: {
	    Node: string;
	    Edge: string;
	    Graph: string;
	}; const LOG_LEVELS: {
	    debug: string;
	    production: string;
	}; function runLevel(): string;
	export { LOG_LEVELS, GENERIC_TYPES, runLevel };

}
declare module 'graphinius/core/typed/TypedEdge' {
	import { IBaseEdge, BaseEdge, BaseEdgeConfig } from 'graphinius/core/base/BaseEdge';
	import * as $N from 'graphinius/core/base/BaseNode';
	export interface ITypedEdge extends IBaseEdge {
	    readonly type: string;
	}
	export interface TypedEdgeConfig extends BaseEdgeConfig {
	    type?: string;
	} class TypedEdge extends BaseEdge implements ITypedEdge {
	    protected _id: string;
	    protected _node_a: $N.IBaseNode;
	    protected _node_b: $N.IBaseNode;
	    protected _type: string;
	    constructor(_id: string, _node_a: $N.IBaseNode, _node_b: $N.IBaseNode, config?: TypedEdgeConfig);
	    readonly type: string;
	}
	export { TypedEdge };

}
declare module 'graphinius/core/base/BaseEdge' {
	import * as $N from 'graphinius/core/base/BaseNode';
	import { TypedEdge } from 'graphinius/core/typed/TypedEdge';
	export interface IConnectedNodes {
	    a: $N.IBaseNode;
	    b: $N.IBaseNode;
	}
	export type EdgeFeatures = {
	    [k: string]: any;
	};
	export interface IBaseEdge {
	    readonly id: string;
	    readonly label: string;
	    readonly features: EdgeFeatures;
	    getID(): string;
	    getLabel(): string;
	    setLabel(label: string): void;
	    getFeatures(): EdgeFeatures;
	    getFeature(key: string): any;
	    f(key: string): any | undefined;
	    setFeatures(features: EdgeFeatures): void;
	    setFeature(key: string, value: any): void;
	    deleteFeature(key: string): any;
	    clearFeatures(): void;
	    isDirected(): boolean;
	    isWeighted(): boolean;
	    getWeight(): number;
	    setWeight(w: number): void;
	    getNodes(): IConnectedNodes;
	    clone(node_a: $N.BaseNode, node_b: $N.BaseNode): IBaseEdge;
	}
	export interface BaseEdgeConfig {
	    directed?: boolean;
	    weighted?: boolean;
	    weight?: number;
	    label?: string;
	    features?: EdgeFeatures;
	} class BaseEdge implements IBaseEdge {
	    protected _id: string;
	    protected _node_a: $N.IBaseNode;
	    protected _node_b: $N.IBaseNode;
	    protected _directed: boolean;
	    protected _weighted: boolean;
	    protected _weight: number;
	    protected _label: string;
	    protected _features: EdgeFeatures;
	    constructor(_id: string, _node_a: $N.IBaseNode, _node_b: $N.IBaseNode, config?: BaseEdgeConfig);
	    readonly id: string;
	    readonly label: string;
	    readonly features: EdgeFeatures;
	    getID(): string;
	    getLabel(): string;
	    setLabel(label: string): void;
	    getFeatures(): {
	        [k: string]: any;
	    };
	    getFeature(key: string): any | undefined;
	    f(key: string): any | undefined;
	    setFeatures(features: {
	        [k: string]: any;
	    }): void;
	    setFeature(key: string, value: any): void;
	    deleteFeature(key: string): any;
	    clearFeatures(): void;
	    isDirected(): boolean;
	    isWeighted(): boolean;
	    getWeight(): number;
	    setWeight(w: number): void;
	    getNodes(): IConnectedNodes;
	    clone(new_node_a: $N.BaseNode, new_node_b: $N.BaseNode): BaseEdge;
	    static isTyped(arg: any): arg is TypedEdge;
	}
	export { BaseEdge };

}
declare module 'graphinius/utils/StructUtils' {
	 function clone(obj: any): any; function shuffleArray(arr: Array<any>): Array<any>; function mergeArrays(args: Array<Array<any>>, cb?: Function): any[]; function mergeObjects(args: Array<Object>): {}; function mergeOrderedArraysNoDups(a: Array<number>, b: Array<number>): Array<number>;
	export { clone, shuffleArray, mergeArrays, mergeObjects, mergeOrderedArraysNoDups };

}
declare module 'graphinius/core/base/BaseNode' {
	import { TypedNode } from 'graphinius/core/typed/TypedNode';
	import { IBaseEdge } from 'graphinius/core/base/BaseEdge';
	export interface NeighborEntry {
	    node: IBaseNode;
	    edge: IBaseEdge;
	    best?: number;
	}
	export interface BaseNodeConfig {
	    label?: string;
	    features?: {
	        [key: string]: any;
	    };
	} type NodeFeatures = {
	    [k: string]: any;
	};
	export interface IBaseNode {
	    readonly id: string;
	    readonly label: string;
	    readonly features: NodeFeatures;
	    setLabel(label: string): void;
	    getID(): string;
	    getLabel(): string;
	    getFeatures(): NodeFeatures;
	    getFeature(key: string): any;
	    f(key: string): any | undefined;
	    setFeatures(features: NodeFeatures): void;
	    setFeature(key: string, value: any): void;
	    deleteFeature(key: string): any;
	    clearFeatures(): void;
	    readonly deg: number;
	    readonly in_deg: number;
	    readonly out_deg: number;
	    readonly self_deg: number;
	    readonly self_in_deg: number;
	    readonly self_out_deg: number;
	    addEdge(edge: IBaseEdge): IBaseEdge;
	    hasEdge(edge: IBaseEdge): boolean;
	    hasEdgeID(id: string): boolean;
	    getEdge(id: string): IBaseEdge;
	    inEdges(): {
	        [k: string]: IBaseEdge;
	    };
	    outEdges(): {
	        [k: string]: IBaseEdge;
	    };
	    undEdges(): {
	        [k: string]: IBaseEdge;
	    };
	    dirEdges(): {
	        [k: string]: IBaseEdge;
	    };
	    allEdges(): {
	        [k: string]: IBaseEdge;
	    };
	    removeEdge(edge: IBaseEdge): void;
	    removeEdgeByID(id: string): void;
	    clearOutEdges(): void;
	    clearInEdges(): void;
	    clearUndEdges(): void;
	    clearEdges(): void;
	    prevNodes(): Array<NeighborEntry>;
	    nextNodes(): Array<NeighborEntry>;
	    connNodes(): Array<NeighborEntry>;
	    reachNodes(identityFunc?: Function): Array<NeighborEntry>;
	    allNeighbors(identityFunc?: Function): Array<NeighborEntry>;
	    clone(): IBaseNode;
	} class BaseNode implements IBaseNode {
	    protected _id: string;
	    protected _label: string;
	    protected _in_deg: number;
	    protected _out_deg: number;
	    protected _deg: number;
	    protected _self_in_deg: number;
	    protected _self_out_deg: number;
	    protected _self_deg: number;
	    protected _features: NodeFeatures;
	    protected _in_edges: {
	        [k: string]: IBaseEdge;
	    };
	    protected _out_edges: {
	        [k: string]: IBaseEdge;
	    };
	    protected _und_edges: {
	        [k: string]: IBaseEdge;
	    };
	    constructor(_id: string, config?: BaseNodeConfig);
	    static isTyped(arg: any): arg is TypedNode;
	    readonly id: string;
	    readonly label: string;
	    readonly features: NodeFeatures;
	    getID(): string;
	    getLabel(): string;
	    setLabel(label: string): void;
	    getFeatures(): {
	        [k: string]: any;
	    };
	    getFeature(key: string): any | undefined;
	    f(key: string): any | undefined;
	    setFeatures(features: {
	        [k: string]: any;
	    }): void;
	    setFeature(key: string, value: any): void;
	    deleteFeature(key: string): any;
	    clearFeatures(): void;
	    readonly deg: number;
	    readonly in_deg: number;
	    readonly out_deg: number;
	    readonly self_deg: number;
	    readonly self_in_deg: number;
	    readonly self_out_deg: number;
	    addEdge(edge: IBaseEdge): IBaseEdge;
	    hasEdge(edge: IBaseEdge): boolean;
	    hasEdgeID(id: string): boolean;
	    getEdge(id: string): IBaseEdge;
	    inEdges(): {
	        [k: string]: IBaseEdge;
	    };
	    outEdges(): {
	        [k: string]: IBaseEdge;
	    };
	    undEdges(): {
	        [k: string]: IBaseEdge;
	    };
	    dirEdges(): {
	        [k: string]: IBaseEdge;
	    };
	    allEdges(): {
	        [k: string]: IBaseEdge;
	    };
	    removeEdge(edge: IBaseEdge): void;
	    removeEdgeByID(id: string): void;
	    clearOutEdges(): void;
	    clearInEdges(): void;
	    clearUndEdges(): void;
	    clearEdges(): void;
	    prevNodes(): Array<NeighborEntry>;
	    nextNodes(): Array<NeighborEntry>;
	    connNodes(): Array<NeighborEntry>;
	    reachNodes(identityFunc?: Function): Array<NeighborEntry>;
	    allNeighbors(identityFunc?: Function): Array<NeighborEntry>;
	    clone(): IBaseNode;
	}
	export { BaseNode };

}
declare module 'graphinius/core/typed/TypedNode' {
	import { IBaseNode, BaseNode, BaseNodeConfig } from 'graphinius/core/base/BaseNode';
	import { ITypedEdge } from 'graphinius/core/typed/TypedEdge';
	export interface NeighborEntry {
	    n: ITypedNode;
	    e: string;
	    w: number;
	}
	export interface TypedAdjListsEntry {
	    ins?: Set<string>;
	    outs?: Set<string>;
	    conns?: Set<string>;
	}
	export type TypedAdjSets = {
	    [type: string]: TypedAdjListsEntry;
	};
	export interface TypedEdgesStatsEntry {
	    ins: number;
	    outs: number;
	    conns: number;
	}
	export interface TypedNodeStats {
	    typed_edges: {
	        [key: string]: TypedEdgesStatsEntry;
	    };
	}
	export interface ITypedNode extends IBaseNode {
	    readonly type: string;
	    readonly stats: TypedNodeStats;
	    uniqueNID(e: ITypedEdge): string;
	    addEdge(edge: ITypedEdge): ITypedEdge;
	    removeEdge(edge: ITypedEdge): void;
	    ins(type: string): Set<string>;
	    outs(type: string): Set<string>;
	    unds(type: string): Set<string>;
	}
	export interface TypedNodeConfig extends BaseNodeConfig {
	    type?: string;
	} class TypedNode extends BaseNode implements ITypedNode {
	    protected _id: string;
	    protected _type: string;
	    protected _typedAdjSets: TypedAdjSets;
	    constructor(_id: string, config?: TypedNodeConfig);
	    readonly type: string;
	    readonly stats: TypedNodeStats;
	    addEdge(edge: ITypedEdge): ITypedEdge;
	    removeEdge(edge: ITypedEdge): void;
	    ins(type: string): Set<string>;
	    outs(type: string): Set<string>;
	    unds(type: string): Set<string>;
	    all(type: string): Set<string>;
	    uniqueNID(e: ITypedEdge): string;
	    static nIDFromUID(uid: string): string;
	    private noEdgesOfTypeLeft;
	}
	export { TypedNode };

}
declare module 'graphinius/core/interfaces' {
	import { ITypedNode } from 'graphinius/core/typed/TypedNode';
	import { ITypedEdge } from 'graphinius/core/typed/TypedEdge';
	export enum DIR {
	    in = "ins",
	    out = "outs",
	    und = "unds"
	}
	export enum GraphMode {
	    INIT = 0,
	    DIRECTED = 1,
	    UNDIRECTED = 2,
	    MIXED = 3
	}
	export interface GraphStats {
	    mode: GraphMode;
	    nr_nodes: number;
	    nr_und_edges: number;
	    nr_dir_edges: number;
	    density_dir: number;
	    density_und: number;
	}
	export type MinAdjacencyListDict = {
	    [id: string]: MinAdjacencyListDictEntry;
	};
	export type MinAdjacencyListDictEntry = {
	    [id: string]: number;
	};
	export type MinAdjacencyListArray = Array<Array<number>>;
	export type NextArray = Array<Array<Array<number>>>;
	export type TypedNodes = Map<string, Map<string, ITypedNode>>;
	export type TypedEdges = Map<string, Map<string, ITypedEdge>>;
	export interface TypedGraphStats extends GraphStats {
	    typed_nodes: {
	        [key: string]: number;
	    };
	    typed_edges: {
	        [key: string]: number;
	    };
	}
	export interface ExpansionConfig {
	    k?: number;
	    freq?: boolean;
	}

}
declare module 'graphinius/utils/CallbackUtils' {
	 function execCallbacks(cbs: Array<Function>, context?: any): void;
	export { execCallbacks };

}
declare module 'graphinius/search/BFS' {
	import { GraphMode } from 'graphinius/core/interfaces';
	import * as $N from 'graphinius/core/base/BaseNode';
	import * as $E from 'graphinius/core/base/BaseEdge';
	import * as $G from 'graphinius/core/base/BaseGraph';
	export interface BFS_Config {
	    result: {
	        [id: string]: BFS_ResultEntry;
	    };
	    callbacks: BFS_Callbacks;
	    dir_mode: GraphMode;
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
	import { GraphMode } from 'graphinius/core/interfaces';
	import * as $N from 'graphinius/core/base/BaseNode';
	import * as $G from 'graphinius/core/base/BaseGraph';
	export interface DFS_Config {
	    visit_result: {};
	    callbacks: DFS_Callbacks;
	    dir_mode: GraphMode;
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
declare module 'graphinius/datastructs/BinaryHeap' {
	export enum BinaryHeapMode {
	    MIN = 0,
	    MAX = 1
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
	    insert(obj: any): void;
	    remove(obj: any): any;
	    private trickleDown;
	    private trickleUp;
	    private orderCorrect;
	    private setNodePosition;
	    private getNodePosition;
	    private removeNodePosition;
	}
	export { BinaryHeap };

}
declare module 'graphinius/search/PFS' {
	import { GraphMode } from 'graphinius/core/interfaces';
	import * as $N from 'graphinius/core/base/BaseNode';
	import * as $G from 'graphinius/core/base/BaseGraph';
	import * as $BH from 'graphinius/datastructs/BinaryHeap';
	export const DEFAULT_WEIGHT: number;
	export interface PFS_Config {
	    result: {
	        [id: string]: PFS_ResultEntry;
	    };
	    callbacks: PFS_Callbacks;
	    dir_mode: GraphMode;
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
	import * as $G from 'graphinius/core/base/BaseGraph';
	import * as $N from 'graphinius/core/base/BaseNode';
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
declare module 'graphinius/utils/Logger' {
	export interface LOG_CONFIG {
	    log_level: string;
	}
	export enum LogColors {
	    FgBlack = 30,
	    FgRed = 31,
	    FgGreen = 32,
	    FgYellow = 33,
	    FgBlue = 34,
	    FgMagenta = 35,
	    FgCyan = 36,
	    FgWhite = 37,
	    BgBlack = 40,
	    BgRed = 41,
	    BgGreen = 42,
	    BgYellow = 43,
	    BgBlue = 44,
	    BgMagenta = 45,
	    BgCyan = 46,
	    BgWhite = 47
	} class Logger {
	    config: LOG_CONFIG;
	    constructor(config?: any);
	    log(msg: any, color?: any, bright?: boolean): boolean;
	    error(err: any, color?: any, bright?: boolean): boolean;
	    dir(obj: any, color?: any, bright?: boolean): boolean;
	    info(msg: any, color?: any, bright?: boolean): boolean;
	    warn(msg: any, color?: any, bright?: boolean): boolean;
	    write(msg: any, color?: any, bright?: boolean): boolean;
	    static colorize(color: any, output: any, bright: any): string;
	}
	export { Logger };

}
declare module 'graphinius/core/compute/ComputeGraph' {
	import { MinAdjacencyListArray, MinAdjacencyListDict, NextArray } from 'graphinius/core/interfaces';
	import { IGraph } from 'graphinius/core/base/BaseGraph';
	export interface IComputeGraph {
	    adjListW(incoming?: boolean, include_self?: any, self_dist?: number): MinAdjacencyListDict;
	    adjMatrix(): MinAdjacencyListArray;
	    adjMatrixW(incoming?: boolean): MinAdjacencyListArray;
	    nextArray(incoming?: boolean): NextArray;
	    triadCount(directed?: boolean): number;
	    triangleCount(directed?: boolean): Promise<number>;
	    transitivity(directed?: boolean): Promise<number>;
	    clustCoef(directed?: boolean): Promise<{
	        [key: string]: number;
	    }>;
	} class ComputeGraph implements IComputeGraph {
	    private _g;
	    private _tf?;
	    private adj_list_uu;
	    private adj_list_du;
	    private adj_list_uw;
	    private adj_list_dw;
	    constructor(_g: IGraph, _tf?: any);
	    nextArray(incoming?: boolean): NextArray;
	    adjMatrix(): MinAdjacencyListArray;
	    adjMatrixW(incoming?: boolean, include_self?: boolean, self_dist?: number): MinAdjacencyListArray;
	    adjListW(incoming?: boolean, include_self?: boolean, self_dist?: number): MinAdjacencyListDict;
	    triadCount(directed?: boolean): number;
	    triangleCount(directed?: boolean): Promise<number>;
	    transitivity(directed?: boolean): Promise<number>;
	    clustCoef(directed?: boolean): Promise<{
	        [key: string]: number;
	    }>;
	}
	export { ComputeGraph };

}
declare module 'graphinius/search/Johnsons' {
	import * as $N from 'graphinius/core/base/BaseNode';
	import * as $G from 'graphinius/core/base/BaseGraph'; function Johnsons(graph: $G.IGraph): {}; function addExtraNandE(target: $G.IGraph, nodeToAdd: $N.IBaseNode): $G.IGraph; function reWeighGraph(target: $G.IGraph, distDict: {}, tempNode: $N.IBaseNode): $G.IGraph; function PFSFromAllNodes(graph: $G.IGraph): {};
	export { Johnsons, addExtraNandE, reWeighGraph, PFSFromAllNodes };

}
declare module 'graphinius/core/typed/TypedGraph' {
	import { ITypedNode, TypedNode } from 'graphinius/core/typed/TypedNode';
	import { ITypedEdge, TypedEdgeConfig } from 'graphinius/core/typed/TypedEdge';
	import { IBaseEdge } from 'graphinius/core/base/BaseEdge';
	import { BaseGraph } from 'graphinius/core/base/BaseGraph';
	import { DIR, ExpansionConfig, TypedGraphStats, TypedEdges, TypedNodes } from 'graphinius/core/interfaces';
	export class TypedGraph extends BaseGraph {
	    _label: string;
	    protected _type: string;
	    protected _typedNodes: TypedNodes;
	    protected _typedEdges: TypedEdges;
	    constructor(_label: string);
	    n(id: string): TypedNode;
	    readonly type: string;
	    nodeTypes(): string[];
	    edgeTypes(): string[];
	    nrTypedNodes(type: string): number | null;
	    nrTypedEdges(type: string): number | null;
	    ins(node: ITypedNode, type: string): Set<ITypedNode>;
	    outs(node: ITypedNode, type: string): Set<ITypedNode>;
	    unds(node: ITypedNode, type: string): Set<ITypedNode>;
	    expand(input: ITypedNode | Set<ITypedNode>, dir: DIR, type: string, cfg?: ExpansionConfig): Set<ITypedNode>;
	    expandK(input: ITypedNode | Set<ITypedNode>, dir: DIR, type: string, cfg?: ExpansionConfig): Set<ITypedNode>;
	    peripheryAtK(input: ITypedNode | Set<ITypedNode>, dir: DIR, type: string, cfg?: ExpansionConfig): Set<ITypedNode>;
	    inHistT(nType: string, eType: string): Set<number>[];
	    outHistT(nType: string, eType: string): Set<number>[];
	    connHistT(nType: string, eType: string): Set<number>[];
	    private degreeHistT;
	    addNodeByID(id: string, opts?: {}): ITypedNode;
	    addNode(node: ITypedNode): ITypedNode;
	    getNodeById(id: string): TypedNode;
	    getNodesT(type: string): Map<string, ITypedNode>;
	    getEdgesT(type: string): Map<string, ITypedEdge>;
	    deleteNode(node: ITypedNode): void;
	    addEdgeByID(id: string, a: ITypedNode, b: ITypedNode, opts?: TypedEdgeConfig): ITypedEdge;
	    addEdge(edge: ITypedEdge | IBaseEdge): ITypedEdge;
	    deleteEdge(edge: ITypedEdge | IBaseEdge): void;
	    getStats(): TypedGraphStats;
	}

}
declare module 'graphinius/core/base/BaseGraph' {
	import { GraphMode, GraphStats } from 'graphinius/core/interfaces';
	import { IBaseNode } from 'graphinius/core/base/BaseNode';
	import { BaseEdgeConfig, IBaseEdge } from 'graphinius/core/base/BaseEdge';
	import { TypedGraph } from 'graphinius/core/typed/TypedGraph';
	export interface IGraph {
	    readonly label: string;
	    readonly mode: GraphMode;
	    readonly stats: GraphStats;
	    getMode(): GraphMode;
	    getStats(): GraphStats;
	    readonly inHist: Set<number>[];
	    readonly outHist: Set<number>[];
	    readonly connHist: Set<number>[];
	    addNode(node: IBaseNode): IBaseNode;
	    addNodeByID(id: string, opts?: {}): IBaseNode;
	    hasNodeID(id: string): boolean;
	    getNodeById(id: string): IBaseNode;
	    n(id: string): IBaseNode;
	    getNodes(): {
	        [key: string]: IBaseNode;
	    };
	    nrNodes(): number;
	    getRandomNode(): IBaseNode;
	    deleteNode(node: any): void;
	    addEdge(edge: IBaseEdge): IBaseEdge;
	    addEdgeByID(label: string, node_a: IBaseNode, node_b: IBaseNode, opts?: {}): IBaseEdge;
	    addEdgeByNodeIDs(label: string, node_a_id: string, node_b_id: string, opts?: {}): IBaseEdge;
	    hasEdgeID(id: string): boolean;
	    getEdgeById(id: string): IBaseEdge;
	    getDirEdgeByNodeIDs(node_a_id: string, node_b_id: string): IBaseEdge;
	    getUndEdgeByNodeIDs(node_a_id: string, node_b_id: string): IBaseEdge;
	    getDirEdges(): {
	        [key: string]: IBaseEdge;
	    };
	    getUndEdges(): {
	        [key: string]: IBaseEdge;
	    };
	    getDirEdgesArray(): Array<IBaseEdge>;
	    getUndEdgesArray(): Array<IBaseEdge>;
	    nrDirEdges(): number;
	    nrUndEdges(): number;
	    deleteEdge(edge: IBaseEdge): void;
	    getRandomDirEdge(): IBaseEdge;
	    getRandomUndEdge(): IBaseEdge;
	    hasNegativeEdge(): boolean;
	    hasNegativeCycles(node?: IBaseNode): boolean;
	    toDirectedGraph(copy?: any): IGraph;
	    toUndirectedGraph(): IGraph;
	    pickRandomProperty(propList: any): any;
	    pickRandomProperties(propList: any, amount: any): Array<string>;
	    deleteInEdgesOf(node: IBaseNode): void;
	    deleteOutEdgesOf(node: IBaseNode): void;
	    deleteDirEdgesOf(node: IBaseNode): void;
	    deleteUndEdgesOf(node: IBaseNode): void;
	    deleteAllEdgesOf(node: IBaseNode): void;
	    clearAllDirEdges(): void;
	    clearAllUndEdges(): void;
	    clearAllEdges(): void;
	    cloneStructure(): IGraph;
	    cloneSubGraphStructure(start: IBaseNode, cutoff: Number): IGraph;
	    reweighIfHasNegativeEdge(clone: boolean): IGraph;
	} class BaseGraph implements IGraph {
	    protected _label: any;
	    protected _nr_nodes: number;
	    protected _nr_dir_edges: number;
	    protected _nr_und_edges: number;
	    protected _mode: GraphMode;
	    protected _nodes: {
	        [key: string]: IBaseNode;
	    };
	    protected _dir_edges: {
	        [key: string]: IBaseEdge;
	    };
	    protected _und_edges: {
	        [key: string]: IBaseEdge;
	    };
	    constructor(_label: any);
	    static isTyped(arg: any): arg is TypedGraph;
	    readonly label: string;
	    readonly mode: GraphMode;
	    readonly stats: GraphStats;
	    readonly inHist: Set<number>[];
	    readonly outHist: Set<number>[];
	    readonly connHist: Set<number>[];
	    private degreeHist;
	    reweighIfHasNegativeEdge(clone?: boolean): IGraph;
	    toDirectedGraph(copy?: boolean): IGraph;
	    toUndirectedGraph(): IGraph;
	    hasNegativeEdge(): boolean;
	    hasNegativeCycles(node?: IBaseNode): boolean;
	    getMode(): GraphMode;
	    getStats(): GraphStats;
	    nrNodes(): number;
	    nrDirEdges(): number;
	    nrUndEdges(): number;
	    addNodeByID(id: string, opts?: {}): IBaseNode;
	    addNode(node: IBaseNode): IBaseNode;
	    hasNodeID(id: string): boolean;
	    getNodeById(id: string): IBaseNode;
	    n(id: string): IBaseNode;
	    getNodes(): {
	        [key: string]: IBaseNode;
	    };
	    getRandomNode(): IBaseNode;
	    deleteNode(node: any): void;
	    hasEdgeID(id: string): boolean;
	    getEdgeById(id: string): IBaseEdge;
	    static checkExistanceOfEdgeNodes(node_a: IBaseNode, node_b: IBaseNode): void;
	    getDirEdgeByNodeIDs(node_a_id: string, node_b_id: string): IBaseEdge;
	    getUndEdgeByNodeIDs(node_a_id: string, node_b_id: string): IBaseEdge;
	    getDirEdges(): {
	        [key: string]: IBaseEdge;
	    };
	    getUndEdges(): {
	        [key: string]: IBaseEdge;
	    };
	    getDirEdgesArray(): Array<IBaseEdge>;
	    getUndEdgesArray(): Array<IBaseEdge>;
	    addEdgeByNodeIDs(label: string, node_a_id: string, node_b_id: string, opts?: {}): IBaseEdge;
	    addEdgeByID(id: string, node_a: IBaseNode, node_b: IBaseNode, opts?: BaseEdgeConfig): IBaseEdge;
	    addEdge(edge: IBaseEdge): IBaseEdge;
	    deleteEdge(edge: IBaseEdge): void;
	    deleteInEdgesOf(node: IBaseNode): void;
	    deleteOutEdgesOf(node: IBaseNode): void;
	    deleteDirEdgesOf(node: IBaseNode): void;
	    deleteUndEdgesOf(node: IBaseNode): void;
	    deleteAllEdgesOf(node: IBaseNode): void;
	    clearAllDirEdges(): void;
	    clearAllUndEdges(): void;
	    clearAllEdges(): void;
	    getRandomDirEdge(): IBaseEdge;
	    getRandomUndEdge(): IBaseEdge;
	    cloneStructure(): IGraph;
	    cloneSubGraphStructure(root: IBaseNode, cutoff: Number): IGraph;
	    protected checkConnectedNodeOrThrow(node: IBaseNode): void;
	    protected updateGraphMode(): void;
	    pickRandomProperty(propList: any): any;
	    pickRandomProperties(propList: any, amount: any): Array<string>;
	}
	export { BaseGraph };

}
declare module 'graphinius/search/FloydWarshall' {
	import { MinAdjacencyListArray, NextArray } from 'graphinius/core/interfaces';
	import { IGraph } from 'graphinius/core/base/BaseGraph'; function FloydWarshallAPSP(graph: IGraph): {}; function FloydWarshallArray(graph: IGraph): MinAdjacencyListArray; function changeNextToDirectParents(input: NextArray): NextArray;
	export { FloydWarshallAPSP, FloydWarshallArray, changeNextToDirectParents };

}
declare module 'graphinius/centralities/Betweenness' {
	import * as $G from 'graphinius/core/base/BaseGraph'; function betweennessCentrality(graph: $G.IGraph, directed?: boolean, sparse?: boolean): {};
	export { betweennessCentrality };

}
declare module 'graphinius/centralities/Brandes' {
	import * as $G from 'graphinius/core/base/BaseGraph';
	export interface BrandesHeapEntry {
	    id: string;
	    best: number;
	} class Brandes {
	    private _graph;
	    private _cg;
	    constructor(_graph: $G.IGraph);
	    computeUnweighted(normalize?: boolean, directed?: boolean): {};
	    computeWeighted(normalize: boolean, directed: boolean): {};
	    computePFSbased(normalize: boolean, directed: boolean): {};
	    normalizeScores(CB: any, N: any, directed: any): void;
	}
	export { Brandes };

}
declare module 'graphinius/centralities/Closeness' {
	import * as $G from 'graphinius/core/base/BaseGraph'; class ClosenessCentrality {
	    constructor();
	    getCentralityMapFW(graph: $G.IGraph): Array<Number>;
	    getCentralityMap(graph: $G.IGraph): {
	        [id: string]: number;
	    };
	}
	export { ClosenessCentrality };

}
declare module 'graphinius/centralities/Degree' {
	import * as $G from 'graphinius/core/base/BaseGraph';
	export enum DegreeMode {
	    in = 0,
	    out = 1,
	    und = 2,
	    dir = 3,
	    all = 4
	}
	export interface DegreeDistribution {
	    in: Uint32Array;
	    out: Uint32Array;
	    dir: Uint32Array;
	    und: Uint32Array;
	    all: Uint32Array;
	} class DegreeCentrality {
	    constructor();
	    getCentralityMap(graph: $G.IGraph, weighted?: boolean, conf?: DegreeMode): {
	        [id: string]: number;
	    };
	    degreeDistribution(graph: $G.IGraph): DegreeDistribution;
	}
	export { DegreeCentrality };

}
declare module 'graphinius/centralities/Pagerank' {
	import { IGraph } from 'graphinius/core/base/BaseGraph';
	export type InitMap = {
	    [id: string]: number;
	};
	export type TeleSet = {
	    [id: string]: number;
	};
	export type RankMap = {
	    [id: string]: number;
	};
	export interface PRArrayDS {
	    curr: Array<number>;
	    old: Array<number>;
	    out_deg: Array<number>;
	    pull: Array<Array<number>>;
	    pull_weight?: Array<Array<number>>;
	    teleport?: Array<number>;
	    tele_size?: number;
	}
	export interface PagerankRWConfig {
	    weighted?: boolean;
	    alpha?: number;
	    epsilon?: number;
	    maxIterations?: number;
	    normalize?: boolean;
	    PRArrays?: PRArrayDS;
	    personalized?: boolean;
	    tele_set?: TeleSet;
	    init_map?: InitMap;
	}
	export interface PRResult {
	    map: RankMap;
	    config: PagerankRWConfig;
	    iters: number;
	    delta: number;
	} class Pagerank {
	    private _graph;
	    private readonly _weighted;
	    private readonly _alpha;
	    private readonly _epsilon;
	    private readonly _maxIterations;
	    private readonly _normalize;
	    private readonly _personalized;
	    private readonly _PRArrayDS;
	    constructor(_graph: IGraph, config?: PagerankRWConfig);
	    getConfig(): PagerankRWConfig;
	    getDSs(): PRArrayDS;
	    constructPRArrayDataStructs(config: PagerankRWConfig): void;
	    getRankMapFromArray(): RankMap;
	    private normalizePR;
	    pull2DTo1D(): Array<number>;
	    computePR(): PRResult;
	}
	export { Pagerank };

}
declare module 'graphinius/mincutmaxflow/MinCutMaxFlowBoykov' {
	import * as $N from 'graphinius/core/base/BaseNode';
	import * as $E from 'graphinius/core/base/BaseEdge';
	import * as $G from 'graphinius/core/base/BaseGraph';
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
declare module 'graphinius/energyminimization/ExpansionBoykov' {
	import * as $N from 'graphinius/core/base/BaseNode';
	import * as $G from 'graphinius/core/base/BaseGraph';
	import * as $MC from 'graphinius/mincutmaxflow/MinCutMaxFlowBoykov';
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
	    initGraph(graph: $G.IGraph): $G.IGraph;
	    prepareEMEStandardConfig(): EMEConfig;
	}
	export { EMEBoykov };

}
declare module 'graphinius/generators/KroneckerLeskovec' {
	import * as $G from 'graphinius/core/base/BaseGraph';
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
declare module 'graphinius/io/interfaces' {
	export interface Abbreviations {
	    coords: string;
	    n_label: string;
	    n_type: string;
	    edges: string;
	    n_features: string;
	    e_to: string;
	    e_dir: string;
	    e_weight: string;
	    e_label: string;
	    e_type: string;
	}
	export const labelKeys: Abbreviations;

}
declare module 'graphinius/io/common/Dupes' {
	import { IBaseEdge } from 'graphinius/core/base/BaseEdge';
	import { ITypedEdge } from 'graphinius/core/typed/TypedEdge';
	import { IBaseNode } from 'graphinius/core/base/BaseNode';
	import { IGraph } from 'graphinius/core/base/BaseGraph';
	import { TypedGraph } from 'graphinius/core/typed/TypedGraph';
	export interface PotentialEdgeInfo {
	    a: IBaseNode;
	    b: IBaseNode;
	    label?: string;
	    dir: boolean;
	    weighted: boolean;
	    weight?: number;
	    typed: boolean;
	    type?: string;
	} class EdgeDupeChecker {
	    private _graph;
	    constructor(_graph: IGraph | TypedGraph);
	    isDupe(e: PotentialEdgeInfo): boolean;
	    potentialEndpoints(e: PotentialEdgeInfo): Set<IBaseEdge | ITypedEdge>;
	    static checkTypeWeightEquality(e: PotentialEdgeInfo, oe: IBaseEdge): boolean;
	    static typeWeightDupe(e: PotentialEdgeInfo, oe: IBaseEdge): boolean;
	}
	export { EdgeDupeChecker };

}
declare module 'graphinius/utils/RemoteUtils' {
	/// <reference types="node" />
	import * as http from 'http';
	export interface RequestConfig {
	    remote_host: string;
	    remote_path: string;
	    file_name: string;
	}
	export function retrieveRemoteFile(config: RequestConfig, cb: Function): http.ClientRequest;
	export function checkNodeEnvironment(): void;

}
declare module 'graphinius/io/input/CSVInput' {
	import * as $G from 'graphinius/core/base/BaseGraph';
	import * as $R from 'graphinius/utils/RemoteUtils';
	export interface ICSVInConfig {
	    separator?: string;
	    explicit_direction?: boolean;
	    direction_mode?: boolean;
	    weighted?: boolean;
	}
	export interface ICSVInput {
	    _config: ICSVInConfig;
	    readFromAdjacencyListFile(filepath: string): $G.IGraph;
	    readFromAdjacencyList(input: Array<string>, graph_name: string): $G.IGraph;
	    readFromAdjacencyListURL(config: $R.RequestConfig, cb: Function): any;
	    readFromEdgeListFile(filepath: string): $G.IGraph;
	    readFromEdgeList(input: Array<string>, graph_name: string): $G.IGraph;
	    readFromEdgeListURL(config: $R.RequestConfig, cb: Function): any;
	} class CSVInput implements ICSVInput {
	    _config: ICSVInConfig;
	    constructor(config?: ICSVInConfig);
	    readFromAdjacencyListURL(config: $R.RequestConfig, cb: Function): void;
	    readFromEdgeListURL(config: $R.RequestConfig, cb: Function): void;
	    private readGraphFromURL;
	    readFromAdjacencyListFile(filepath: string): $G.IGraph;
	    readFromEdgeListFile(filepath: string): $G.IGraph;
	    private readFileAndReturn;
	    readFromAdjacencyList(input: Array<string>, graph_name: string): $G.IGraph;
	    readFromEdgeList(input: Array<string>, graph_name: string, weighted?: boolean): $G.IGraph;
	}
	export { CSVInput };

}
declare module 'graphinius/io/input/JSONInput' {
	import { IBaseNode } from 'graphinius/core/base/BaseNode';
	import { ITypedNode } from 'graphinius/core/typed/TypedNode';
	import { TypedGraph } from 'graphinius/core/typed/TypedGraph';
	import { IGraph } from 'graphinius/core/base/BaseGraph';
	import * as $R from 'graphinius/utils/RemoteUtils';
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
	    typeRLT: {
	        nodes: {};
	        edges: {};
	    };
	    name: string;
	    nodes: number;
	    edges: number;
	    data: {
	        [key: string]: JSONNode;
	    };
	}
	export interface IJSONInConfig {
	    explicit_direction?: boolean;
	    directed?: boolean;
	    weighted?: boolean;
	    typed?: boolean;
	    dupeCheck?: boolean;
	}
	export interface IJSONInput {
	    _config: IJSONInConfig;
	    readFromJSONFile(file: string, graph?: IGraph): IGraph;
	    readFromJSON(json: {}, graph?: IGraph): IGraph;
	    readFromJSONURL(config: $R.RequestConfig, cb: Function, graph?: IGraph): void;
	} class JSONInput implements IJSONInput {
	    _config: IJSONInConfig;
	    constructor(config?: IJSONInConfig);
	    readFromJSONFile(filepath: string, graph?: IGraph): IGraph;
	    readFromJSONURL(config: $R.RequestConfig, cb: Function, graph?: IGraph): void;
	    readFromJSON(json: JSONGraph, graph?: IGraph | TypedGraph): IGraph | TypedGraph;
	    addNodesToGraph(json: JSONGraph, graph: IGraph): void;
	    getTargetNode(graph: any, edge_input: any): IBaseNode | ITypedNode;
	    static handleEdgeWeights(edge_input: any): number;
	}
	export { JSONInput };

}
declare module 'graphinius/io/output/CSVOutput' {
	import * as $G from 'graphinius/core/base/BaseGraph';
	export interface ICSVOutConfig {
	    separator?: string;
	    explicit_direction?: boolean;
	    direction_mode?: boolean;
	    weighted?: boolean;
	}
	export interface ICSVOutput {
	    _config: ICSVOutConfig;
	    writeToAdjacencyListFile(filepath: string, graph: $G.IGraph): void;
	    writeToAdjacencyList(graph: $G.IGraph): string;
	    writeToEdgeListFile(filepath: string, graph: $G.IGraph, weighted: boolean): void;
	    writeToEdgeList(graph: $G.IGraph, weighted: boolean): string;
	} class CSVOutput implements ICSVOutput {
	    _config: ICSVOutConfig;
	    constructor(config?: ICSVOutConfig);
	    writeToAdjacencyListFile(filepath: string, graph: $G.IGraph): void;
	    writeToAdjacencyList(graph: $G.IGraph): string;
	    writeToEdgeListFile(filepath: string, graph: $G.IGraph, weighted?: boolean): void;
	    writeToEdgeList(graph: $G.IGraph, weighted?: boolean): string;
	    private mergeFunc;
	}
	export { CSVOutput };

}
declare module 'graphinius/io/output/JSONOutput' {
	import * as $E from 'graphinius/core/base/BaseEdge';
	import * as $G from 'graphinius/core/base/BaseGraph';
	import { TypedGraph } from 'graphinius/core/typed/TypedGraph';
	export interface IJSONOutput {
	    writeToJSONFile(filepath: string, graph: $G.IGraph): void;
	    writeToJSONString(graph: $G.IGraph): string;
	}
	export interface TypeLUT {
	    nodes: {
	        [key: string]: string;
	    };
	    edges: {
	        [key: string]: string;
	    };
	} class JSONOutput implements IJSONOutput {
	    constructTypeRLUT(g: TypedGraph): [TypeLUT, TypeLUT];
	    writeToJSONFile(filepath: string, graph: $G.IGraph): void;
	    writeToJSONString(graph: $G.IGraph): string;
	    static handleEdgeWeight(edge: $E.IBaseEdge): string | number;
	}
	export { JSONOutput };

}
declare module 'graphinius/partitioning/Interfaces' {
	import { IBaseNode } from 'graphinius/core/base/BaseNode';
	export interface GraphPartitioning {
	    partitions: Map<number, Partition>;
	    nodePartMap: Map<string, number>;
	    cut_cost: number;
	}
	export interface Partition {
	    nodes: Map<string, IBaseNode>;
	}

}
declare module 'graphinius/partitioning/KCut' {
	import { IGraph } from 'graphinius/core/base/BaseGraph';
	import { GraphPartitioning } from 'graphinius/partitioning/Interfaces';
	export class KCut {
	    private _graph;
	    private _partitioning;
	    constructor(_graph: IGraph);
	    cut(k: number, shuffle?: boolean): GraphPartitioning;
	}

}
declare module 'graphinius/partitioning/KLPartitioning' {
	import { IGraph } from 'graphinius/core/base/BaseGraph';
	import { IBaseNode } from 'graphinius/core/base/BaseNode';
	import { GraphPartitioning } from 'graphinius/partitioning/Interfaces';
	import { BinaryHeap } from 'graphinius/datastructs/BinaryHeap';
	export type GainEntry = {
	    id: string;
	    source: IBaseNode;
	    target: IBaseNode;
	    gain: number;
	};
	export interface KL_Costs {
	    internal: {
	        [key: string]: number;
	    };
	    external: {
	        [key: string]: number;
	    };
	}
	export interface KL_Config {
	    initShuffle?: boolean;
	    directed?: boolean;
	    weighted?: boolean;
	}
	export interface KL_Open_Sets {
	    partition_a: Map<string, boolean>;
	    partition_b: Map<string, boolean>;
	}
	export class KLPartitioning {
	    private _graph;
	    _partitionings: Map<number, GraphPartitioning>;
	    _costs: KL_Costs;
	    _gainsHeap: BinaryHeap;
	    _bestPartitioning: number;
	    _currentPartitioning: number;
	    _open_sets: KL_Open_Sets;
	    _adjList: {};
	    private _keys;
	    private _config;
	    private _gainsHash;
	    private _cg;
	    constructor(_graph: IGraph, config?: KL_Config);
	    private initPartitioning;
	    private initCosts;
	    initGainsHeap(): void;
	    performIteration(): void;
	    updateCosts(swap_ge: GainEntry): void;
	    doSwapAndDropLockedConnections(): GainEntry;
	    private removeGainsEntry;
	}

}
declare module 'graphinius/perturbation/SimplePerturbations' {
	import * as $N from 'graphinius/core/base/BaseNode';
	import * as $E from 'graphinius/core/base/BaseEdge';
	import * as $G from 'graphinius/core/base/BaseGraph';
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
	    createEdgesProb(probability: number, directed?: boolean, setOfNodes?: {
	        [key: string]: $N.IBaseNode;
	    }): void;
	    createEdgesSpan(min: number, max: number, directed?: boolean, setOfNodes?: {
	        [key: string]: $N.IBaseNode;
	    }): void;
	    addNodesPercentage(percentage: number, config?: NodeDegreeConfiguration): void;
	    addNodesAmount(amount: number, config?: NodeDegreeConfiguration): void;
	    addUndEdgesPercentage(percentage: number): void;
	    addDirEdgesPercentage(percentage: number): void;
	    addEdgesAmount(amount: number, config?: $E.BaseEdgeConfig): void;
	    deleteNodesPercentage(percentage: number): void;
	    deleteUndEdgesPercentage(percentage: number): void;
	    deleteDirEdgesPercentage(percentage: number): void;
	    deleteNodesAmount(amount: number): void;
	    deleteUndEdgesAmount(amount: number): void;
	    deleteDirEdgesAmount(amount: number): void;
	} class SimplePerturber implements ISimplePerturber {
	    private _graph;
	    constructor(_graph: $G.IGraph);
	    deleteNodesPercentage(percentage: number): void;
	    deleteUndEdgesPercentage(percentage: number): void;
	    deleteDirEdgesPercentage(percentage: number): void;
	    deleteNodesAmount(amount: number): void;
	    deleteUndEdgesAmount(amount: number): void;
	    deleteDirEdgesAmount(amount: number): void;
	    addUndEdgesPercentage(percentage: number): void;
	    addDirEdgesPercentage(percentage: number): void;
	    addEdgesAmount(amount: number, config?: $E.BaseEdgeConfig): void;
	    addNodesPercentage(percentage: number, config?: NodeDegreeConfiguration): void;
	    addNodesAmount(amount: number, config?: NodeDegreeConfiguration): void;
	    private createEdgesByConfig;
	    createEdgesProb(probability: number, directed?: boolean, new_nodes?: {
	        [key: string]: $N.IBaseNode;
	    }): void;
	    createEdgesSpan(min: number, max: number, directed?: boolean, setOfNodes?: {
	        [key: string]: $N.IBaseNode;
	    }): void;
	}
	export { SimplePerturber };

}
declare module 'graphinius/similarities/interfaces' {
	import { DIR } from 'graphinius/core/interfaces';
	export type SetOfSets = {
	    [key: string]: Set<any>;
	};
	export interface Similarity {
	    isect?: number;
	    sim: number;
	}
	export interface SimilarityEntry extends Similarity {
	    from: string;
	    to: string;
	}
	export type SimilarityResult = SimilarityEntry[];
	export interface TopKEntry extends Similarity {
	    from: string;
	    to: string;
	}
	export type TopKArray = TopKEntry[];
	export type TopKDict = {
	    [key: string]: TopKEntry[];
	};
	export interface SortCutFuncs {
	    sort?: (e1: SimilarityEntry, e2: SimilarityEntry) => number;
	    cutFunc?: (sim: number, thres: number) => boolean;
	}
	export interface SimilarityConfig extends SortCutFuncs {
	    cutoff?: number;
	    knn?: number;
	    dup?: boolean;
	}
	export interface SimPerSharedPrefConfig extends SortCutFuncs {
	    t1: string;
	    t2: string;
	    d1: DIR;
	    d2: DIR;
	    e1: string;
	    e2: string;
	    co?: number;
	}

}
declare module 'graphinius/similarities/SetSimilarities' {
	import * as $I from 'graphinius/similarities/interfaces';
	export const simFuncs: {
	    jaccard: typeof jaccard;
	    overlap: typeof overlap;
	}; function jaccard(a: Set<any>, b: Set<any>): $I.Similarity; function overlap(a: Set<any>, b: Set<any>): $I.Similarity;
	export {};

}
declare module 'graphinius/similarities/SimilarityCommons' {
	import * as $I from 'graphinius/similarities/interfaces';
	import { TypedGraph } from 'graphinius/core/typed/TypedGraph';
	import { ITypedNode } from 'graphinius/core/typed/TypedNode';
	export const sortFuncs: {
	    asc: (se1: $I.SimilarityEntry, se2: $I.SimilarityEntry) => number;
	    desc: (se1: $I.SimilarityEntry, se2: $I.SimilarityEntry) => number;
	};
	export const cutFuncs: {
	    above: (sim: number, threshold: number) => boolean;
	    below: (sim: number, threshold: number) => boolean;
	};
	export function sim(algo: Function, a: Set<any>, b: Set<any>): any;
	export function simSource(algo: Function, s: string, t: $I.SetOfSets, cfg?: $I.SimilarityConfig): $I.SimilarityResult;
	export function simPairwise(algo: Function, s: $I.SetOfSets, cfg?: $I.SimilarityConfig): $I.SimilarityResult;
	export function simSubsets(algo: Function, s1: $I.SetOfSets, s2: $I.SetOfSets, cfg?: $I.SimilarityConfig): $I.SimilarityResult;
	export function knnNodeArray(algo: Function, s: $I.SetOfSets, cfg: $I.SimilarityConfig): $I.TopKArray;
	export function knnNodeDict(algo: Function, s: $I.SetOfSets, cfg: $I.SimilarityConfig): $I.TopKDict;
	export function viaSharedPrefs(g: TypedGraph, algo: Function, cfg: $I.SimPerSharedPrefConfig): any[];
	export function getBsNotInA(a: Set<ITypedNode>, b: Set<ITypedNode>): Set<ITypedNode>;

}
declare module 'graphinius/perturbation/TheAugments' {
	import { ITypedEdge } from 'graphinius/core/typed/TypedEdge';
	import { TypedGraph } from 'graphinius/core/typed/TypedGraph';
	import * as $I from 'graphinius/similarities/interfaces';
	interface SubSetConfig extends $I.SortCutFuncs {
	    rtype: string;
	    knn?: number;
	    cutoff?: number;
	} class TheAugments {
	    private _g;
	    constructor(_g: TypedGraph);
	    addSubsetRelationship(algo: Function, sets: $I.SetOfSets, cfg: SubSetConfig): Set<ITypedEdge>;
	}
	export { TheAugments };

}
declare module 'graphinius/search/Dijkstra' {
	import * as $N from 'graphinius/core/base/BaseNode';
	import * as $G from 'graphinius/core/base/BaseGraph';
	import * as $PFS from 'graphinius/search/PFS'; function Dijkstra(graph: $G.IGraph, source: $N.IBaseNode, target?: $N.IBaseNode): {
	    [id: string]: $PFS.PFS_ResultEntry;
	};
	export { Dijkstra };

}
declare module 'graphinius/similarities/ScoreSimilarities' {
	export const simFuncs: {
	    cosine: typeof cosine;
	    cosineSets: typeof cosineSets;
	    euclidean: typeof euclidean;
	    euclideanSets: typeof euclideanSets;
	    pearson: typeof pearson;
	    pearsonSets: typeof pearsonSets;
	}; function euclidean(a: number[], b: number[]): {
	    sim: number;
	}; function cosine(a: number[], b: number[]): {
	    sim: number;
	}; function pearson(a: number[], b: number[], a_mean?: number, b_mean?: number): {
	    sim: any;
	}; function cosineSets(a: Set<string>, b: Set<string>): {
	    sim: number;
	}; function euclideanSets(a: Set<string>, b: Set<string>): {
	    sim: number;
	}; function pearsonSets(a: Set<string>, b: Set<string>): {
	    sim: any;
	};
	export {};

}
