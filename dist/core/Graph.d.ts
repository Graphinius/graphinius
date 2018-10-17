/// <reference path="../../typings/tsd.d.ts" />
import * as $N from './Nodes';
import * as $E from './Edges';
export declare enum GraphMode {
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
export declare type MinAdjacencyListDict = {
    [id: string]: MinAdjacencyListDictEntry;
};
export declare type MinAdjacencyListDictEntry = {
    [id: string]: number;
};
export declare type MinAdjacencyListArray = Array<Array<number>>;
export declare type NextArray = Array<Array<Array<number>>>;
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
