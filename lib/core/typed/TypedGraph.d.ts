import { IBaseEdge } from '../base/BaseEdge';
import { ITypedNode } from './TypedNode';
import { BaseGraph, GraphStats } from '../base/BaseGraph';
export declare const GENERIC_TYPE = "GENERIC";
export declare type TypedNodes = Map<string, Map<string, ITypedNode>>;
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
    addNode(node: ITypedNode): boolean;
    deleteNode(node: ITypedNode): void;
    addEdge(edge: IBaseEdge): boolean;
    deleteEdge(edge: IBaseEdge): void;
    getStats(): TypedGraphStats;
}
