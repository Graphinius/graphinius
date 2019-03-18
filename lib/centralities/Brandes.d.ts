import * as $G from '../core/Graph';
declare function BrandesUnweighted(graph: $G.IGraph, normalize?: boolean, directed?: boolean): {};
export interface BrandesHeapEntry {
    id: string;
    best: number;
}
declare function BrandesWeighted(graph: $G.IGraph, normalize: boolean, directed: boolean): {};
declare function BrandesPFSbased(graph: $G.IGraph, normalize: boolean, directed: boolean): {};
declare function normalizeScores(CB: any, N: any, directed: any): void;
export { BrandesUnweighted, BrandesWeighted, BrandesPFSbased, normalizeScores };
