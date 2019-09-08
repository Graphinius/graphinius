export declare const simFuncs: {
    cosine: typeof cosine;
    cosineSets: typeof cosineSets;
    euclidean: typeof euclidean;
    euclideanSets: typeof euclideanSets;
    pearson: typeof pearson;
    pearsonSets: typeof pearsonSets;
};
declare function euclidean(a: number[], b: number[]): {
    sim: number;
};
declare function cosine(a: number[], b: number[]): {
    sim: number;
};
declare function pearson(a: number[], b: number[], a_mean?: number, b_mean?: number): {
    sim: any;
};
declare function cosineSets(a: Set<string>, b: Set<string>): {
    sim: number;
};
declare function euclideanSets(a: Set<string>, b: Set<string>): {
    sim: number;
};
declare function pearsonSets(a: Set<string>, b: Set<string>): {
    sim: any;
};
export {};
