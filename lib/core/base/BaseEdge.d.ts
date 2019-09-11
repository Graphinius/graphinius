import * as $N from "./BaseNode";
import { TypedEdge } from '../typed/TypedEdge';
export interface IConnectedNodes {
    a: $N.IBaseNode;
    b: $N.IBaseNode;
}
export declare type EdgeFeatures = {
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
}
declare class BaseEdge implements IBaseEdge {
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
