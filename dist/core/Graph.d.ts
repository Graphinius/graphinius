/// <reference path="../../typings/tsd.d.ts" />
import * as $N from './Nodes';
import * as $E from './Edges';
export declare enum GraphMode {
    INIT = 0,
    DIRECTED = 1,
    UNDIRECTED = 2,
    MIXED = 3,
}
export interface DegreeDistribution {
    in: Uint16Array;
    out: Uint16Array;
    dir: Uint16Array;
    und: Uint16Array;
    all: Uint16Array;
}
export interface GraphStats {
    mode: GraphMode;
    nr_nodes: number;
    nr_und_edges: number;
    nr_dir_edges: number;
}
export interface IGraph {
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
    createRandomEdgesProb(probability: number, directed?: boolean): void;
    createRandomEdgesSpan(min: number, max: number, directed?: boolean): void;
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
export { BaseGraph };
