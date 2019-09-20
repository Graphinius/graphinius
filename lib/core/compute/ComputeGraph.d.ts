import { MinAdjacencyListArray, MinAdjacencyListDict, NextArray } from "../interfaces";
import { IGraph } from "../base/BaseGraph";
export interface IComputeGraph {
    adjListW(incoming?: boolean, include_self?: any, self_dist?: number): MinAdjacencyListDict;
    adjMatrix(): MinAdjacencyListArray;
    adjMatrixW(incoming?: boolean): MinAdjacencyListArray;
    nextArray(incoming?: boolean): NextArray;
    triadCount(directed?: boolean): number;
    triangleCount(directed?: boolean): Promise<number>;
    transitivity(directed?: boolean): Promise<number>;
    clustCoef(directed?: boolean): Promise<{
        [key: string]: number;
    }>;
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
    adjMatrix(): MinAdjacencyListArray;
    adjMatrixW(incoming?: boolean, include_self?: boolean, self_dist?: number): MinAdjacencyListArray;
    adjListW(incoming?: boolean, include_self?: boolean, self_dist?: number): MinAdjacencyListDict;
    triadCount(directed?: boolean): number;
    triangleCount(directed?: boolean): Promise<number>;
    transitivity(directed?: boolean): Promise<number>;
    clustCoef(directed?: boolean): Promise<{
        [key: string]: number;
    }>;
}
export { ComputeGraph };
