/// <reference path="../../typings/tsd.d.ts" />
import * as $E from "./Edges";
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
}
declare class BaseNode implements IBaseNode {
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
