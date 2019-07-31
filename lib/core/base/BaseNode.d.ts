import * as $E from "./BaseEdge";
export interface NeighborEntry {
    node: IBaseNode;
    edge: $E.IBaseEdge;
    best?: number;
}
export interface BaseNodeConfig {
    label?: string;
    features?: {
        [key: string]: any;
    };
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
    allNeighbors(identityFunc?: Function): Array<NeighborEntry>;
    clone(): IBaseNode;
}
declare class BaseNode implements IBaseNode {
    protected _id: string;
    protected _label: string;
    protected _in_degree: number;
    protected _out_degree: number;
    protected _und_degree: number;
    protected _features: {
        [k: string]: any;
    };
    protected _in_edges: {
        [k: string]: $E.IBaseEdge;
    };
    protected _out_edges: {
        [k: string]: $E.IBaseEdge;
    };
    protected _und_edges: {
        [k: string]: $E.IBaseEdge;
    };
    constructor(_id: string, config?: BaseNodeConfig);
    getID(): string;
    getLabel(): string;
    setLabel(label: string): void;
    getFeatures(): {
        [k: string]: any;
    };
    getFeature(key: string): any | undefined;
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
    allNeighbors(identityFunc?: Function): Array<NeighborEntry>;
    clone(): IBaseNode;
}
export { BaseNode };
