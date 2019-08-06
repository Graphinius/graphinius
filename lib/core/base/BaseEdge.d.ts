import * as $N from "./BaseNode";
import { TypedEdge } from '../typed/TypedEdge';
export interface IConnectedNodes {
    a: $N.IBaseNode;
    b: $N.IBaseNode;
}
export interface IBaseEdge {
    readonly id: string;
    readonly label: string;
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
export interface BaseEdgeConfig {
    directed?: boolean;
    weighted?: boolean;
    weight?: number;
    label?: string;
}
declare class BaseEdge implements IBaseEdge {
    protected _id: string;
    protected _node_a: $N.IBaseNode;
    protected _node_b: $N.IBaseNode;
    protected _directed: boolean;
    protected _weighted: boolean;
    protected _weight: number;
    protected _label: string;
    constructor(_id: string, _node_a: $N.IBaseNode, _node_b: $N.IBaseNode, config?: BaseEdgeConfig);
    readonly id: string;
    readonly label: string;
    getID(): string;
    getLabel(): string;
    setLabel(label: string): void;
    isDirected(): boolean;
    isWeighted(): boolean;
    getWeight(): number;
    setWeight(w: number): void;
    getNodes(): IConnectedNodes;
    clone(new_node_a: $N.BaseNode, new_node_b: $N.BaseNode): BaseEdge;
    static isTyped(arg: any): arg is TypedEdge;
}
export { BaseEdge };
