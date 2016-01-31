/// <reference path="../../typings/tsd.d.ts" />
import * as $E from "./Edges";
interface IBaseNode {
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
    removeEdge(edge: $E.IBaseEdge): void;
    removeEdgeID(id: string): void;
    clearOutEdges(): void;
    clearInEdges(): void;
    clearUndEdges(): void;
    clearEdges(): void;
    prevNodes(): Array<IBaseNode>;
    nextNodes(): Array<IBaseNode>;
    connNodes(): Array<IBaseNode>;
    adjNodes(): Array<IBaseNode>;
}
declare class BaseNode implements IBaseNode {
    protected _id: any;
    /**
     * degrees - let's hold them separate in order
     * to avoid Object.keys(...)
     */
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
    protected _label: string;
    constructor(_id: any, features?: {
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
    removeEdge(edge: $E.IBaseEdge): void;
    removeEdgeID(id: string): void;
    clearOutEdges(): void;
    clearInEdges(): void;
    clearUndEdges(): void;
    clearEdges(): void;
    prevNodes(): Array<IBaseNode>;
    nextNodes(): Array<IBaseNode>;
    connNodes(): Array<IBaseNode>;
    adjNodes(): Array<IBaseNode>;
}
export { IBaseNode, BaseNode };

import * as $N from "./Nodes";
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
}
export interface EdgeConstructorOptions {
    directed?: boolean;
    weighted?: boolean;
    weight?: number;
    label?: string;
}
declare class BaseEdge implements IBaseEdge {
    protected _id: any;
    protected _node_a: $N.IBaseNode;
    protected _node_b: $N.IBaseNode;
    protected _directed: boolean;
    protected _weighted: boolean;
    protected _weight: number;
    protected _label: string;
    constructor(_id: any, _node_a: $N.IBaseNode, _node_b: $N.IBaseNode, options?: EdgeConstructorOptions);
    getID(): string;
    getLabel(): string;
    setLabel(label: string): void;
    isDirected(): boolean;
    isWeighted(): boolean;
    getWeight(): number;
    setWeight(w: number): void;
    getNodes(): IConnectedNodes;
}
export { BaseEdge };

/// <reference path="../../typings/tsd.d.ts" />
import * as $N from './Nodes';
import * as $E from './Edges';
declare enum GraphMode {
    INIT = 0,
    DIRECTED = 1,
    UNDIRECTED = 2,
    MIXED = 3,
}
interface DegreeDistribution {
    in: Uint16Array;
    out: Uint16Array;
    dir: Uint16Array;
    und: Uint16Array;
    all: Uint16Array;
}
interface GraphStats {
    mode: GraphMode;
    nr_nodes: number;
    nr_und_edges: number;
    nr_dir_edges: number;
}
interface IGraph {
    _label: string;
    getMode(): GraphMode;
    getStats(): GraphStats;
    degreeDistribution(): DegreeDistribution;
    addNode(id: string, opts?: {}): $N.IBaseNode;
    hasNodeID(id: string): boolean;
    hasNodeLabel(label: string): boolean;
    getNodeById(id: string): $N.IBaseNode;
    getNodeByLabel(label: string): $N.IBaseNode;
    getNodes(): {
        [key: string]: $N.IBaseNode;
    };
    nrNodes(): number;
    getRandomNode(): $N.IBaseNode;
    deleteNode(node: any): void;
    addEdge(label: string, node_a: $N.IBaseNode, node_b: $N.IBaseNode, opts?: {}): $E.IBaseEdge;
    addEdgeByNodeIDs(label: string, node_a_id: string, node_b_id: string, opts?: {}): $E.IBaseEdge;
    hasEdgeID(id: string): boolean;
    hasEdgeLabel(label: string): boolean;
    getEdgeById(id: string): $E.IBaseEdge;
    getEdgeByLabel(label: string): $E.IBaseEdge;
    getDirEdges(): {
        [key: string]: $E.IBaseEdge;
    };
    getUndEdges(): {
        [key: string]: $E.IBaseEdge;
    };
    nrDirEdges(): number;
    nrUndEdges(): number;
    deleteEdge(edge: $E.IBaseEdge): void;
    getRandomDirEdge(): $E.IBaseEdge;
    getRandomUndEdge(): $E.IBaseEdge;
    deleteInEdgesOf(node: $N.IBaseNode): void;
    deleteOutEdgesOf(node: $N.IBaseNode): void;
    deleteDirEdgesOf(node: $N.IBaseNode): void;
    deleteUndEdgesOf(node: $N.IBaseNode): void;
    deleteAllEdgesOf(node: $N.IBaseNode): void;
    clearAllDirEdges(): void;
    clearAllUndEdges(): void;
    clearAllEdges(): void;
    createRandomEdgesProb(probability: number, directed: boolean): void;
    createRandomEdgesSpan(min: number, max: number, directed: boolean): void;
}
declare class BaseGraph implements IGraph {
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
    getMode(): GraphMode;
    getStats(): GraphStats;
    /**
     * We assume graphs in which no node has higher total degree than 65536
     */
    degreeDistribution(): DegreeDistribution;
    nrNodes(): number;
    nrDirEdges(): number;
    nrUndEdges(): number;
    addNode(id: string, opts?: {}): $N.IBaseNode;
    hasNodeID(id: string): boolean;
    /**
     * Use hasNodeLabel with CAUTION ->
     * it has LINEAR runtime in the graph's #nodes
     */
    hasNodeLabel(label: string): boolean;
    getNodeById(id: string): $N.IBaseNode;
    /**
     * Use getNodeByLabel with CAUTION ->
     * it has LINEAR runtime in the graph's #nodes
     */
    getNodeByLabel(label: string): $N.IBaseNode;
    getNodes(): {
        [key: string]: $N.IBaseNode;
    };
    /**
     * CAUTION - This function takes linear time in # nodes
     */
    getRandomNode(): $N.IBaseNode;
    deleteNode(node: any): void;
    hasEdgeID(id: string): boolean;
    /**
     * Use hasEdgeLabel with CAUTION ->
     * it has LINEAR runtime in the graph's #edges
     */
    hasEdgeLabel(label: string): boolean;
    getEdgeById(id: string): $E.IBaseEdge;
    /**
     * Use hasEdgeLabel with CAUTION ->
     * it has LINEAR runtime in the graph's #edges
     */
    getEdgeByLabel(label: string): $E.IBaseEdge;
    getDirEdges(): {
        [key: string]: $E.IBaseEdge;
    };
    getUndEdges(): {
        [key: string]: $E.IBaseEdge;
    };
    addEdgeByNodeIDs(label: string, node_a_id: string, node_b_id: string, opts?: {}): $E.IBaseEdge;
    addEdge(id: string, node_a: $N.IBaseNode, node_b: $N.IBaseNode, opts?: $E.EdgeConstructorOptions): $E.IBaseEdge;
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
     * Simple edge generator:
     * Go through all node combinations, and
     * add an (un)directed edge with
     * @param probability and
     * @direction true or false
     * CAUTION: this algorithm takes quadratic runtime in #nodes
     */
    createRandomEdgesProb(probability: number, directed?: boolean): void;
    /**
     * Simple edge generator:
     * Go through all nodes, and
     * add [min, max] (un)directed edges to
     * a randomly chosen node
     * CAUTION: this algorithm could take quadratic runtime in #nodes
     * but should be much faster
     */
    createRandomEdgesSpan(min: number, max: number, directed?: boolean): void;
    /**
     * CAUTION - This function is linear in # directed edges
     */
    getRandomDirEdge(): $E.IBaseEdge;
    /**
     * CAUTION - This function is linear in # undirected edges
     */
    getRandomUndEdge(): $E.IBaseEdge;
    protected checkConnectedNodeOrThrow(node: $N.IBaseNode): void;
    protected updateGraphMode(): void;
    private pickRandomProperty(obj);
}
export { DegreeDistribution, GraphMode, GraphStats, IGraph, BaseGraph };

/// <reference path="../../typings/tsd.d.ts" />
import * as $G from '../core/Graph';
interface ICSVInput {
    _separator: string;
    _explicit_direction: boolean;
    _direction_mode: boolean;
    readFromAdjacencyListFile(filepath: string): $G.IGraph;
    readFromAdjacencyList(input: Array<string>, graph_name: string): $G.IGraph;
    readFromAdjacencyListURL(fileurl: string, cb: Function): any;
    readFromEdgeListFile(filepath: string): $G.IGraph;
    readFromEdgeList(input: Array<string>, graph_name: string): $G.IGraph;
    readFromEdgeListURL(fileurl: string, cb: Function): any;
}
declare class CSVInput implements ICSVInput {
    _separator: string;
    _explicit_direction: boolean;
    _direction_mode: boolean;
    constructor(_separator?: string, _explicit_direction?: boolean, _direction_mode?: boolean);
    readFromAdjacencyListURL(fileurl: string, cb: Function): void;
    readFromEdgeListURL(fileurl: string, cb: Function): void;
    private readGraphFromURL(fileurl, cb, localFun);
    readFromAdjacencyListFile(filepath: string): $G.IGraph;
    readFromEdgeListFile(filepath: string): $G.IGraph;
    private readFileAndReturn(filepath, func);
    readFromAdjacencyList(input: Array<string>, graph_name: string): $G.IGraph;
    readFromEdgeList(input: Array<string>, graph_name: string): $G.IGraph;
    private checkNodeEnvironment();
}
export { ICSVInput, CSVInput };

/// <reference path="../../typings/tsd.d.ts" />
import * as $G from '../core/Graph';
export interface JSONNode {
    edges: Array<string>;
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
    _direction_mode: boolean;
    readFromJSONFile(file: string): $G.IGraph;
    readFromJSON(json: {}): $G.IGraph;
    readFromJSONURL(fileurl: string, cb: Function): void;
}
declare class JSONInput implements IJSONInput {
    _explicit_direction: boolean;
    _direction_mode: boolean;
    constructor(_explicit_direction?: boolean, _direction_mode?: boolean);
    readFromJSONFile(filepath: string): $G.IGraph;
    readFromJSONURL(fileurl: string, cb: Function): void;
    /**
     * In this case, there is one great difference to the CSV edge list cases:
     * If you don't explicitly define a directed edge, it will simply
     * instantiate an undirected one
     * we'll leave that for now, as we will produce apt JSON sources later anyways...
     */
    readFromJSON(json: JSONGraph): $G.IGraph;
    private checkNodeEnvironment();
}
export { JSONInput };

/// <reference path="../../typings/tsd.d.ts" />
import * as $N from '../core/Nodes';
import * as $G from '../core/Graph';
export interface BFSResult {
    distance: number;
    parent: $N.IBaseNode;
    counter: number;
}
declare function BFS(graph: $G.IGraph, root: $N.IBaseNode): {
    [id: string]: BFSResult;
};
export { BFS };

/// <reference path="../../typings/tsd.d.ts" />
import * as $N from '../core/Nodes';
import * as $G from '../core/Graph';
export interface DFS_Callbacks {
    init_dfs?: Array<Function>;
    init_dfs_visit?: Array<Function>;
    node_popped?: Array<Function>;
    node_marked?: Array<Function>;
    node_unmarked?: Array<Function>;
    adj_nodes_pushed?: Array<Function>;
}
export interface StackEntry {
    node: $N.IBaseNode;
    parent: $N.IBaseNode;
}
export interface DFSVisitScope {
    marked_temp: {
        [id: string]: boolean;
    };
    stack: Array<StackEntry>;
    adj_nodes: Array<$N.IBaseNode>;
    stack_entry: StackEntry;
    current: $N.IBaseNode;
    current_root: $N.IBaseNode;
}
export interface DFSScope {
    marked: {
        [id: string]: boolean;
    };
    nodes: {
        [id: string]: $N.IBaseNode;
    };
}
declare function DFSVisit(graph: $G.IGraph, current_root: $N.IBaseNode, callbacks?: DFS_Callbacks, dir_mode?: $G.GraphMode): void;
declare function DFS(graph: $G.IGraph, callbacks?: DFS_Callbacks, dir_mode?: $G.GraphMode): void;
declare function prepareStandardDFSVisitCBs(result: {}, callbacks: DFS_Callbacks, count: number): void;
declare function prepareStandardDFSCBs(result: {}, callbacks: DFS_Callbacks, count: number): void;
/**
 * @param context this pointer to the DFS or DFSVisit function
 */
declare function execCallbacks(cbs: Array<Function>, context: any): void;
export { DFSVisit, DFS, prepareStandardDFSVisitCBs, prepareStandardDFSCBs, execCallbacks };
