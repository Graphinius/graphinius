import { DIR } from "@/core/interfaces";

/*----------------------------------*/
/*		INTERFACES, TYPES & ENUMS			*/
/*----------------------------------*/

export type SetOfSets = { [key: string]: Set<any> };

export interface Similarity {
  isect?: number; // intersection (# of items)
  sim: number; // similarity
}

export interface SimilarityEntry extends Similarity {
  from: string;
  to: string;
}

export type SimilarityResult = SimilarityEntry[];

export interface TopKEntry extends Similarity {
  from: string;
  to: string;
}
export type TopKArray = TopKEntry[];
export type TopKDict = { [key: string]: TopKEntry[] };

export interface SortCutFuncs {
  sort?: (e1: SimilarityEntry, e2: SimilarityEntry) => number;
  cutFunc?: (sim: number, thres: number) => boolean;
}

export interface SimilarityConfig extends SortCutFuncs {
  cutoff?: number;
  knn?: number;
  dup?: boolean;
}

/**
 * @param t1 type of node set 1
 * @param t2 type of node set 2
 * @param d1 traversal direction for t1
 * @param d2 traversal direction for t2
 * @param e1 edge type to follow for t1
 * @param e2 edge type to follow for t2
 * @param co cutoff below which entry will be omitted
 */
export interface SimPerSharedPrefConfig extends SortCutFuncs {
  t1: string;
  t2: string;
  d1: DIR;
  d2: DIR;
  e1: string;
  e2: string;
  co?: number;
}
