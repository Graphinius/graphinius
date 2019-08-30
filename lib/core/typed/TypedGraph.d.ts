import { ITypedNode, TypedNode } from './TypedNode';
import { ITypedEdge, TypedEdgeConfig } from "./TypedEdge";
import { IBaseEdge } from "../base/BaseEdge";
import { BaseGraph, GraphStats } from '../base/BaseGraph';
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
    protected _type: string;
    protected _typedNodes: TypedNodes;
    protected _typedEdges: TypedEdges;
    constructor(_label: string);
    n(id: string): TypedNode;
    readonly type: string;
    nodeTypes(): string[];
    edgeTypes(): string[];
    nrTypedNodes(type: string): number | null;
    nrTypedEdges(type: string): number | null;
    ins(node: ITypedNode, type: string): Set<ITypedNode>;
    outs(node: ITypedNode, type: string): Set<ITypedNode>;
    conns(node: ITypedNode, type: string): Set<ITypedNode>;
    inHistT(nType: string, eType: string): Set<number>[];
    outHistT(nType: string, eType: string): Set<number>[];
    connHistT(nType: string, eType: string): Set<number>[];
    private degreeHistT;
    addNodeByID(id: string, opts?: {}): ITypedNode;
    addNode(node: ITypedNode): ITypedNode;
    getNodeById(id: string): TypedNode;
    getNodesT(type: string): Map<string, ITypedNode>;
    getEdgesT(type: string): Map<string, ITypedEdge>;
    deleteNode(node: ITypedNode): void;
    addEdgeByID(id: string, a: ITypedNode, b: ITypedNode, opts?: TypedEdgeConfig): ITypedEdge;
    addEdge(edge: ITypedEdge | IBaseEdge): ITypedEdge;
    deleteEdge(edge: ITypedEdge | IBaseEdge): void;
    getStats(): TypedGraphStats;
}
