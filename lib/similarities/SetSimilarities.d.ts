import * as $I from './interfaces';
export declare const simFuncs: {
    jaccard: typeof jaccard;
    overlap: typeof overlap;
};
declare function jaccard(a: Set<any>, b: Set<any>): $I.Similarity;
declare function overlap(a: Set<any>, b: Set<any>): $I.Similarity;
export {};
