import * as $I from './interfaces';
import {TypedGraph} from '../core/typed/TypedGraph';
import { ITypedNode } from '../core/typed/TypedNode';


export const simSort = {
	asc: (se1: $I.SimilarityEntry, se2: $I.SimilarityEntry) => se1.sim - se2.sim,
	desc: (se1: $I.SimilarityEntry, se2: $I.SimilarityEntry) => se2.sim - se1.sim
};


export const cutFuncs = {
	above: (sim: number, threshold: number) => sim >= threshold,
	below: (sim: number, threshold: number) => sim <= threshold,
};


/*----------------------------------*/
/*			SIMILARITY FUNCTIONS				*/
/*----------------------------------*/

export function sim(algo: Function, a: Set<any>, b: Set<any>) {
	return algo(a, b);
}


/**
 * @description similarity between set & particular node
 * 							sorted by similarity DESC
 * 
 * @param algo similarity function to use
 * @param s source set
 * @param t target sets to measure similarity to
 * @param cfg object
 */
export function simSource(algo: Function, s: string, t: $I.SetOfSets, cfg: $I.SimilarityConfig = {}) : $I.SimilarityResult {
	const sort = cfg.sort || simSort.desc;
	const cutFunc = cfg.cutFunc || cutFuncs.above;

	let result: $I.SimilarityResult = [];
	const start = t[s];
	for ( let [k,v] of Object.entries(t)) {
		if ( k === s ) {
			continue;
		}
		const sim: $I.Similarity = algo(start, v);
		if ( cfg.cutoff == null || cutFunc(sim.sim, cfg.cutoff ) ) {
			result.push({from: s, to: k, ...sim});
		}
	}
	result.sort(sort);
	if ( cfg.knn != null && cfg.knn <= result.length ) {
		result = result.slice(0, cfg.knn);
	}
	return result.sort(sort);
}


/**
 * @description pairwise is a *symmetrical* algorithm, so we only need to
 * 							compute similarities in one direction
 * 
 * @param algo similarity function to use
 * @param s all sets
 * @param cfg object
 */
export function simPairwise(algo: Function, s: $I.SetOfSets, cfg: $I.SimilarityConfig = {}) : $I.SimilarityResult {
	const sort = cfg.sort || simSort.desc;
	const cutFunc = cfg.cutFunc || cutFuncs.above;

	let result: $I.SimilarityResult = [];
	const keys = Object.keys(s);
	for ( let i in keys ) {
		for ( let j = 0; j < +i; j++) {
			const from = keys[i];
			const to = keys[j];
			const sim = algo(s[keys[i]], s[keys[j]], i, j);
			if ( cfg.cutoff == null || cutFunc(sim.sim, cfg.cutoff ) ) {
				result.push({from, to, ...sim});
			}
		}
	}
	result.sort(sort);
	if ( cfg.knn != null && cfg.knn <= result.length ) {
		result = result.slice(0, cfg.knn);
	}
	return result;
}


/**
 * @description similarity of individuals of one subset to another
 * @description kNN relates to each s1-node's subset
 * 
 * @param algo 
 * @param s1 
 * @param s2 
 * @param cfg
 * 
 * @returns an array of Similarity entries
 */
export function simSubsets(algo: Function, s1: $I.SetOfSets, s2: $I.SetOfSets, cfg: $I.SimilarityConfig = {}) : $I.SimilarityResult {
	const sort = cfg.sort || simSort.desc;
	const cutFunc = cfg.cutFunc || cutFuncs.above;

	let result: $I.SimilarityResult = [];
	const keys1 = Object.keys(s1);
	const keys2 = Object.keys(s2);
	for ( let i in keys1 ) {
		let subRes = [];
		for ( let j in keys2 ) {
			const from = keys1[i];
			const to = keys2[j];
			if ( from === to ) {
				continue;
			}
			const sim = algo(s1[keys1[i]], s2[keys2[j]]);
			if ( cfg.cutoff == null || cutFunc(sim.sim, cfg.cutoff) ) {
				subRes.push({from, to, ...sim});
			}
		}
		subRes.sort(sort);
		if ( cfg.knn != null && cfg.knn <= subRes.length ) {
			subRes = subRes.slice(0, cfg.knn);
		}
		result = result.concat(subRes);
	}
	return result.sort(sort);
}


// /**
//  * @description similarity of two groups to one another
//  * 							just collects sets & calls sim()
//  *
//  * @param algo
//  * @param s1
//  * @param s2
//  * @param config
//  *
//  * @returns an array of Similarity entries
//  */
export function simGroups(algo: Function, s1: $I.SetOfSets, s2: $I.SetOfSets, config: $I.SimilarityConfig = {}) : $I.Similarity {
	throw new Error('not implemented yet');
	return {isect: 0, sim: 0};
}


/**
 * @description top-K per node
 *
 * @param algo similarity function to use
 * @param s all sets
 * @param cfg
 *
 * @returns most similar neighbor per node
 *
 * @todo there are no duplicates in this array, similarities might differ in different directions -> adapt!
 */
export function knnNodeArray(algo: Function, s: $I.SetOfSets, cfg: $I.SimilarityConfig) : $I.TopKArray {
	const sort = cfg.sort || simSort.desc;
	const c = cfg.cutoff || 0;

	const topK: $I.TopKArray = [];
	const dupes = {};
	for ( let node of Object.keys(s) ) {
		const topKEntries: $I.SimilarityEntry[] = simSource(algo, node, s, {knn: cfg.knn || 1, sort: cfg.sort});
		topKEntries.forEach(e => {
			// console.log(e);
			if ( c == null || e.sim < c ) {
				return;
			}
			if (!cfg.dup && ( dupes[e.from] && dupes[e.from][e.to] || dupes[e.to] && dupes[e.to][e.from] ) ) {
				return;
			}
			topK.push(e);
			dupes[e.from] = dupes[e.from] || {};
			dupes[e.from][e.to] = true;
		});
	}
	return topK.sort(sort);
}


/**
 *
 * @param algo
 * @param s
 * @param cfg
 */
export function knnNodeDict(algo: Function, s: $I.SetOfSets, cfg: $I.SimilarityConfig) {
	const sort = cfg.sort || simSort.desc;
	const c = cfg.cutoff || 0;

	const topK: $I.TopKDict = {};
	for ( let node of Object.keys(s) ) {
		const topKEntries: $I.SimilarityEntry[] = simSource(algo, node, s, {knn: cfg.knn || 1, sort: cfg.sort});
		topKEntries.forEach(e => {
			// console.log(e);
			if ( c == null || e.sim < c) {
				return;
			}
			delete e.from;
			topK[node] = topK[node] || [];
			topK[node].push(e);
		});
		for ( let arr of Object.values(topK) ) {
			arr.sort(sort);
		} 
	}
	return topK;
}


/**
 * @description Returns similarities of 2 node sets depending on shared preferences
 * @description default cutoff similarity is 1e-6
 * 
 * @param g graph
 * @param algo similarity function to use
 * @param cfg config object of type SimPerSharedPrefConfig
 * 
 * @returns something
 * 
 * @todo type return value
 * @todo get rid of graph somehow (transfer method to other class...!)
 */
export function viaSharedPrefs(g: TypedGraph, algo: Function, cfg: $I.SimPerSharedPrefConfig ) {
	const sort = cfg.sort || simSort.desc;
	const cutoff = cfg.co == null ? 1e-6 : cfg.co;
	const cutFunc = cfg.cutFunc || cutFuncs.above;

	const sims = [];
	const t1Set = g.getNodesT(cfg.t1);
	const t2Set = g.getNodesT(cfg.t2);

	for ( let [t1Name, t1Node] of t1Set.entries() ) {
		for ( let [t2Name, t2Node] of t2Set.entries() ) {
			const prefSet1 = g[cfg.d1](t1Node, cfg.e1.toUpperCase());
			const prefSet2 = g[cfg.d2](t2Node, cfg.e2.toUpperCase());
			const sim = algo(prefSet1, prefSet2);
			if ( cutFunc(sim.sim, cutoff) ) {
				sims.push({from: t1Name, to: t2Name, ...sim});
			}
		}
	}
	return sims.sort(sort);
}


/**
 * @description returns Set of elements in B that are not in A
 * @param a 
 * @param b 
 */
export function getBsNotInA(a: Set<ITypedNode>, b: Set<ITypedNode>) : Set<ITypedNode> {
  let result = new Set<ITypedNode>();
  let sa = new Set(), sb = new Set();
  for ( let e of a ) sa.add(e.label);
  // for ( let e of b ) sb.add(e.label);
  for ( let e of b ) {
    if ( !sa.has(e.label) ) {
      result.add(e);
    }
  }
  return result;
}



/**
 * @description works, but we would have to completely re-vamp $G typed traversals
 * 				 			in order to speed the code up by a factor of ~2...
 * @todo Fuck speed for the moment -> concern yourself with optimization ->
 * 						!!! AFTER THE FUCKING DEMO !!!
 * @todo I think this doesn't pay off in any way...
 */
// function simUint32(a: Uint32Array, b: Uint32Array) : Similarity {
// 	a = a.sort();
// 	b = b.sort();
// 	const union = [];
// 	let
// 		i = 0,
// 		j = 0;
// 	while ( i < a.length || j < b.length ) {
// 		if ( i >= a.length ) {
// 			union.push(b[j++]);
// 		}
// 		else if ( j >= b.length ) {
// 			union.push(a[i++]);
// 		}
// 		else {
// 			union.push(a[i]);
// 			if (a[i++] !== b[j]) {
// 				union.push(b[j++]);
// 			}
// 			else {
// 				j++;
// 			}
// 		}
// 	}
// 	const intersectSize = a.length + b.length - union.length;
// 	return {isect: intersectSize, sim: intersectSize / union.length};
// }
