import { ClusteringCoefs, MinAdjacencyListArray, MinAdjacencyListDict, NextArray } from "../interfaces";
import { IGraph } from "../base/BaseGraph";
export interface IComputeGraph {
    adjListDict(incoming?: boolean, include_self?: any, self_dist?: number): MinAdjacencyListDict;
    adjListArray(incoming?: boolean): MinAdjacencyListArray;
    nextArray(incoming?: boolean): NextArray;
    readonly clustCoef: ClusteringCoefs;
}
declare class ComputeGraph implements IComputeGraph {
    private _g;
    private _tf?;
    private adj_list_uu;
    private adj_list_du;
    private adj_list_uw;
    private adj_list_dw;
    constructor(_g: IGraph, _tf?: any);
    nextArray(incoming?: boolean): NextArray;
    adjListArray(incoming?: boolean, include_self?: boolean, self_dist?: number): MinAdjacencyListArray;
    adjListDict(incoming?: boolean, include_self?: boolean, self_dist?: number): MinAdjacencyListDict;
    readonly clustCoef: ClusteringCoefs;
}
export { ComputeGraph };
