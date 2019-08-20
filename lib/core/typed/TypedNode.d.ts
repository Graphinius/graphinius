import { IBaseNode, BaseNode, BaseNodeConfig } from '../base/BaseNode';
import { ITypedEdge } from "./TypedEdge";
export declare type NeighborEntries = Set<string>;
export interface TypedAdjListsEntry {
    ins?: NeighborEntries;
    outs?: NeighborEntries;
    conns?: NeighborEntries;
}
export declare type TypedAdjSets = {
    [type: string]: TypedAdjListsEntry;
};
export interface TypedEdgesStatsEntry {
    ins: number;
    outs: number;
    conns: number;
}
export interface TypedNodeStats {
    typed_edges: {
        [key: string]: TypedEdgesStatsEntry;
    };
}
export interface ITypedNode extends IBaseNode {
    readonly type: string;
    readonly stats: TypedNodeStats;
    uniqueNID(e: ITypedEdge): string;
    addEdge(edge: ITypedEdge): ITypedEdge;
    removeEdge(edge: ITypedEdge): void;
    ins(type: string): NeighborEntries;
    outs(type: string): NeighborEntries;
    conns(type: string): NeighborEntries;
}
export interface TypedNodeConfig extends BaseNodeConfig {
    type?: string;
}
declare class TypedNode extends BaseNode implements ITypedNode {
    protected _id: string;
    protected _type: string;
    protected _typedAdjSets: TypedAdjSets;
    constructor(_id: string, config?: TypedNodeConfig);
    readonly type: string;
    readonly stats: TypedNodeStats;
    addEdge(edge: ITypedEdge): ITypedEdge;
    removeEdge(edge: ITypedEdge): void;
    ins(type: string): NeighborEntries;
    outs(type: string): NeighborEntries;
    conns(type: string): NeighborEntries;
    all(type: string): NeighborEntries;
    uniqueNID(e: ITypedEdge): string;
    static nIDFromUID(uid: string): string;
    private noEdgesOfTypeLeft;
}
export { TypedNode };
