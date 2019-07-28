import * as $G from '../core/BaseGraph';
export interface BrandesHeapEntry {
    id: string;
    best: number;
}
declare class Brandes {
    private _graph;
    constructor(_graph: $G.IGraph);
    computeUnweighted(normalize?: boolean, directed?: boolean): {};
    computeWeighted(normalize: boolean, directed: boolean): {};
    computePFSbased(normalize: boolean, directed: boolean): {};
    normalizeScores(CB: any, N: any, directed: any): void;
}
export { Brandes };
