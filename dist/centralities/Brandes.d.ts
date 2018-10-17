/// <reference path="../../typings/tsd.d.ts" />
/**
 * Previous version created by ru on 14.09.17 is to be found below.
 * Modifications by Rita on 28.02.2018 - now it can handle branchings too.
 * CONTENTS:
 * Brandes: according to Brandes 2001, it is meant for unweighted graphs (+undirected according to the paper, but runs fine on directed ones, too)
 * BrandesForWeighted: according to Brandes 2007, handles WEIGHTED graphs, including graphs with null edges
 * PFSdictBased: an alternative for our PFS, not heap based but dictionary based, however, not faster (see BetweennessTests)
 */
import * as $G from '../core/Graph';
/**
 * @param graph input graph
 * @returns Dict of betweenness centrality values for each node
 * @constructor
 */
declare function BrandesUnweighted(graph: $G.IGraph, normalize?: boolean, directed?: boolean): {};
export interface BrandesHeapEntry {
    id: string;
    best: number;
}
declare function BrandesWeighted(graph: $G.IGraph, normalize: boolean, directed: boolean): {};
/**
 *
 * @param graph
 * @param normalize
 * @param directed
 *
 * @todo decide to remove or not
 */
declare function BrandesPFSbased(graph: $G.IGraph, normalize: boolean, directed: boolean): {};
declare function normalizeScores(CB: any, N: any, directed: any): void;
export { BrandesUnweighted, BrandesWeighted, BrandesPFSbased, normalizeScores };
