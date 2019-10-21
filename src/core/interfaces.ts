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

export type ExpansionInput = ITypedNode | Set<ITypedNode> | ExpansionResult;

export interface ExpansionConfig {
	k?		: number;
}

export interface ExpansionResult {
	set		: Set<ITypedNode>;
	freq	: Map<ITypedNode, number>;
}

/**
 * @todo make it so
 */
// export type ExpansionResult = Map<ITypedNode, number>;

/**
 * For figuring out abberations to n4j expansion results (sometimes tiny)
 *
 * @todo maybe this is just experimental, maybe not...
 */
type Inbounds = {[key: string] : number}; // sourceID => freq of sourceNode
export type ExpansionInbounds = {[key: string] : Inbounds};

