import * as $E from './BaseEdge';
import { TypedNode } from '../typed/TypedNode';
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
declare type NodeFeatures = {
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
    addEdge(edge: $E.IBaseEdge): $E.IBaseEdge;
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
    dirEdges(): {
        [k: string]: $E.IBaseEdge;
    };
    allEdges(): {
        [k: string]: $E.IBaseEdge;
    };
    removeEdge(edge: $E.IBaseEdge): void;
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
declare class BaseNode implements IBaseNode {
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
        [k: string]: $E.IBaseEdge;
    };
    protected _out_edges: {
        [k: string]: $E.IBaseEdge;
    };
    protected _und_edges: {
        [k: string]: $E.IBaseEdge;
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
    addEdge(edge: $E.IBaseEdge): $E.IBaseEdge;
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
    dirEdges(): {
        [k: string]: $E.IBaseEdge;
    };
    allEdges(): {
        [k: string]: $E.IBaseEdge;
    };
    removeEdge(edge: $E.IBaseEdge): void;
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
