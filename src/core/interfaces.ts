import {ITypedNode} from "./typed/TypedNode";
import {ITypedEdge} from "./typed/TypedEdge";

/*----------------------------------------*/
/*							BASE GRAPH								*/
/*----------------------------------------*/

/**
 * @todo maybe refactor to more sensible value(type)s...
 */
export enum DIR {
	in = "ins",
	out = "outs",
	und = "unds"
}

export enum GraphMode {
	INIT,
	DIRECTED,
	UNDIRECTED,
	MIXED
}

export interface GraphStats {
	mode					: GraphMode;
	nr_nodes			: number;
	nr_und_edges	: number;
	nr_dir_edges	: number;
	density_dir		: number;
	density_und		: number;
}

export interface TriadCount {
	und: number;
	dir: number;
}

export interface ClusteringCoefs {
	und : number;
	dir : number;
	// typed...
}

/**
 * Only gives the best distance to a node in case of multiple direct edges
 */
export type MinAdjacencyListDict = {[id: string]: MinAdjacencyListDictEntry};

export type MinAdjacencyListDictEntry = {[id: string] : number};

export type MinAdjacencyListArray = Array<Array<number>>;

export type NextArray = Array<Array<Array<number>>>;


/*----------------------------------------*/
/*							TYPED GRAPH								*/
/*----------------------------------------*/
export type TypedNodes = Map<string, Map<string, ITypedNode>>;
export type TypedEdges = Map<string, Map<string, ITypedEdge>>;

export interface TypedGraphStats extends GraphStats {
	typed_nodes: { [key: string]: number };
	typed_edges: { [key: string]: number };
}

