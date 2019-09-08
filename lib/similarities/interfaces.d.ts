import { DIR } from '../core/interfaces';
export declare type SetOfSets = {
    [key: string]: Set<any>;
};
export interface Similarity {
    isect?: number;
    sim: number;
}
export interface SimilarityEntry extends Similarity {
    from: string;
    to: string;
}
export declare type SimilarityResult = SimilarityEntry[];
export interface TopKEntry extends Similarity {
    from: string;
    to: string;
}
export declare type TopKArray = TopKEntry[];
export declare type TopKDict = {
    [key: string]: TopKEntry[];
};
export interface SortCutFuncs {
    sort?: (e1: SimilarityEntry, e2: SimilarityEntry) => number;
    cutFunc?: (sim: number, thres: number) => boolean;
}
export interface SimilarityConfig extends SortCutFuncs {
    cutoff?: number;
    knn?: number;
    dup?: boolean;
}
export interface SimPerSharedPrefConfig extends SortCutFuncs {
    t1: string;
    t2: string;
    d1: DIR;
    d2: DIR;
    e1: string;
    e2: string;
    co?: number;
}
