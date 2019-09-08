import * as $I from './interfaces';
import { TypedGraph } from '../core/typed/TypedGraph';
import { ITypedNode } from '../core/typed/TypedNode';
export declare const simSort: {
    asc: (se1: $I.SimilarityEntry, se2: $I.SimilarityEntry) => number;
    desc: (se1: $I.SimilarityEntry, se2: $I.SimilarityEntry) => number;
};
export declare const cutFuncs: {
    above: (sim: number, threshold: number) => boolean;
    below: (sim: number, threshold: number) => boolean;
};
export declare function sim(algo: Function, a: Set<any>, b: Set<any>): any;
export declare function simSource(algo: Function, s: string, t: $I.SetOfSets, cfg?: $I.SimilarityConfig): $I.SimilarityResult;
export declare function simPairwise(algo: Function, s: $I.SetOfSets, cfg?: $I.SimilarityConfig): $I.SimilarityResult;
export declare function simSubsets(algo: Function, s1: $I.SetOfSets, s2: $I.SetOfSets, cfg?: $I.SimilarityConfig): $I.SimilarityResult;
export declare function simGroups(algo: Function, s1: $I.SetOfSets, s2: $I.SetOfSets, config?: $I.SimilarityConfig): $I.Similarity;
export declare function knnNodeArray(algo: Function, s: $I.SetOfSets, cfg: $I.SimilarityConfig): $I.TopKArray;
export declare function knnNodeDict(algo: Function, s: $I.SetOfSets, cfg: $I.SimilarityConfig): $I.TopKDict;
export declare function viaSharedPrefs(g: TypedGraph, algo: Function, cfg: $I.SimPerSharedPrefConfig): any[];
export declare function getBsNotInA(a: Set<ITypedNode>, b: Set<ITypedNode>): Set<ITypedNode>;
