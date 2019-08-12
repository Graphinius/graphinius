import { IBaseNode, BaseNode, BaseNodeConfig } from '../base/BaseNode';
import { ITypedEdge } from "./TypedEdge";
export declare type NeighborEntries = Set<string>;
export interface TypedAdjListsEntry {
    ins?: NeighborEntries;
    outs?: NeighborEntries;
    conns?: NeighborEntries;
}
export declare type TypedAdjLists = {
    [type: string]: TypedAdjListsEntry;
};
export interface ITypedNode extends IBaseNode {
    readonly type: string;
    uniqueNID(e: ITypedEdge): string;
    addEdge(edge: ITypedEdge): ITypedEdge;
    removeEdge(edge: ITypedEdge): void;
    removeEdgeByID(id: string): void;
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
    protected _typedAdjSets: TypedAdjLists;
    constructor(_id: string, config?: TypedNodeConfig);
    readonly type: string;
    addEdge(edge: ITypedEdge): ITypedEdge;
    removeEdge(edge: ITypedEdge): void;
    removeEdgeByID(id: string): void;
    ins(type: string): NeighborEntries;
    outs(type: string): NeighborEntries;
    conns(type: string): NeighborEntries;
    uniqueNID(e: ITypedEdge): string;
    private noEdgesOfTypeLeft;
}
export { TypedNode };
