import { IGraph } from '../core/base/BaseGraph';
import { GraphPartitioning } from './Interfaces';
export declare class KCut {
    private _graph;
    private _partitioning;
    constructor(_graph: IGraph);
    cut(k: number, shuffle?: boolean): GraphPartitioning;
}
