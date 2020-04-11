import { TypedNode } from '../typed/TypedNode';
import { IBaseEdge } from "./BaseEdge";
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
    get id(): string;
    get label(): string;
    get features(): NodeFeatures;
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
    get deg(): number;
    get in_deg(): number;
    get out_deg(): number;
    get self_deg(): number;
    get self_in_deg(): number;
    get self_out_deg(): number;
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
