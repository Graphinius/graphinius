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
