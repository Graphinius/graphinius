import { ITypedNode } from './TypedNode';
import { ITypedEdge, TypedEdgeConfig } from "./TypedEdge";
import { IBaseEdge } from "../base/BaseEdge";
import { BaseGraph, GraphStats } from '../base/BaseGraph';
export declare const GENERIC_TYPE = "GENERIC";
export declare type TypedNodes = Map<string, Map<string, ITypedNode>>;
export declare type TypedEdges = Map<string, Map<string, ITypedEdge>>;
export interface TypedGraphStats extends GraphStats {
    typed_nodes: {
        [key: string]: number;
    };
    typed_edges: {
        [key: string]: number;
    };
}
export declare class TypedGraph extends BaseGraph {
    _label: string;
    protected _typedNodes: TypedNodes;
    protected _typedEdges: TypedEdges;
    constructor(_label: string);
    readonly typed: true;
    nodeTypes(): string[];
    edgeTypes(): string[];
    nrTypedNodes(type: string): number | null;
    nrTypedEdges(type: string): number | null;
    addNodeByID(id: string, opts?: {}): ITypedNode;
    addNode(node: ITypedNode): ITypedNode;
    deleteNode(node: ITypedNode): void;
    addEdgeByID(id: string, a: ITypedNode, b: ITypedNode, opts?: TypedEdgeConfig): ITypedEdge;
    addEdge(edge: ITypedEdge | IBaseEdge): ITypedEdge;
    deleteEdge(edge: ITypedEdge | IBaseEdge): void;
    getStats(): TypedGraphStats;
}
