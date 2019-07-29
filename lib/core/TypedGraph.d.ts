import { IBaseNode } from './BaseNode';
import { IBaseEdge } from './BaseEdge';
import { BaseGraph, GraphStats } from './BaseGraph';
export declare const GENERIC_TYPE = "GENERIC";
export declare type TypedNodes = Map<string, Map<string, IBaseNode>>;
export declare type TypedEdges = Map<string, Map<string, IBaseEdge>>;
export interface TypedGraphStats extends GraphStats {
    node_types: string[];
    edge_types: string[];
    typed_nodes: {
        [key: string]: number;
    };
    typed_edges: {
        [key: string]: number;
    };
}
export declare class TypedGraph extends BaseGraph {
    _label: any;
    protected _typedNodes: TypedNodes;
    protected _typedEdges: TypedEdges;
    constructor(_label: any);
    nodeTypes(): string[];
    edgeTypes(): string[];
    nrTypedNodes(type: string): number | null;
    nrTypedEdges(type: string): number | null;
    addNode(node: IBaseNode): boolean;
    deleteNode(node: IBaseNode): void;
    addEdge(edge: IBaseEdge): boolean;
    deleteEdge(edge: IBaseEdge): void;
    getStats(): TypedGraphStats;
}
