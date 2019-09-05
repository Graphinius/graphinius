import { IBaseNode, BaseNode, BaseNodeConfig } from '../base/BaseNode';
import { ITypedEdge } from "./TypedEdge";
export interface NeighborEntry {
    n: ITypedNode;
    e: string;
    w: number;
}
export interface TypedAdjListsEntry {
    ins?: Set<string>;
    outs?: Set<string>;
    conns?: Set<string>;
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
    ins(type: string): Set<string>;
    outs(type: string): Set<string>;
    unds(type: string): Set<string>;
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
    ins(type: string): Set<string>;
    outs(type: string): Set<string>;
    unds(type: string): Set<string>;
    all(type: string): Set<string>;
    uniqueNID(e: ITypedEdge): string;
    static nIDFromUID(uid: string): string;
    private noEdgesOfTypeLeft;
}
export { TypedNode };
