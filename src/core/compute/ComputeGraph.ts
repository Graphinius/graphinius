import {MinAdjacencyListArray, MinAdjacencyListDict, NextArray} from "../interfaces";
import {IGraph} from "../base/BaseGraph";

import {Logger} from "../../utils/Logger";
import {IBaseNode} from "../base/BaseNode";
const logger = new Logger();

const DEFAULT_WEIGHT = 1;


export interface NumericHandler {
	tensor2d: Function;
	matMul: Function;
}


export interface IComputeGraph {
	// REPRESENTATIONS
	adjListW(incoming?: boolean, include_self?, self_dist?: number): MinAdjacencyListDict;

	adjMatrix(): MinAdjacencyListArray;

	adjMatrixW(incoming?: boolean): MinAdjacencyListArray;

	nextArray(incoming?: boolean): NextArray;

	// METRICS
	triadCount(directed?: boolean): number;

	triangleCount(directed?: boolean): Promise<number>;

	globalCC(directed?: boolean): Promise<number>;

	localCC(directed? : boolean) : Promise<{[key: string]: number}>;
}


class ComputeGraph implements IComputeGraph {

	private adj_list_uu: Uint32Array;
	private adj_list_du: Uint32Array;
	private adj_list_uw: Float32Array;
	private adj_list_dw: Float32Array;


	constructor(private _g: IGraph, private _numeric?: NumericHandler) { }


	checkNumericHandler() {
		if (!this._numeric || !this._numeric.matMul) {
			throw new Error("Tensorflow & TF matMul function must be present for fast numeric computations.");
		}
	}


	/**
	 * @param incoming
	 * @todo analyze and make faster
	 */
	nextArray(incoming: boolean = false): NextArray {
		let next = [],
			node_keys = Object.keys(this._g.getNodes());

		const adjDict = this.adjListW(incoming, true, 0);

		for (let i = 0; i < this._g.nrNodes(); ++i) {
			next.push([]);
			for (let j = 0; j < this._g.nrNodes(); ++j) {
				next[i].push([]);
				next[i][j].push(i === j ? j : isFinite(adjDict[node_keys[i]][node_keys[j]]) ? j : null);
			}
		}
		return next;
	}


	adjMatrix(): MinAdjacencyListArray {
		let adjList = [],
			node_keys = Object.keys(this._g.getNodes());

		const adjDict = this.adjListW();

		for (let i = 0; i < this._g.nrNodes(); ++i) {
			adjList.push([]);
			for (let j = 0; j < this._g.nrNodes(); ++j) {
				adjList[i].push(i === j ? 0 : isFinite(adjDict[node_keys[i]][node_keys[j]]) ? 1 : 0);
			}
		}
		return adjList;
	}


	/**
	 * @todo rename? it's actually a weight matrix...
	 *
	 * This function iterates over the adjDict in order to use it's advantage
	 * of being able to override edges if edges with smaller weights exist
	 *
	 * However, the order of nodes in the array represents the order of nodes
	 * at creation time, no other implicit alphabetical or collational sorting.
	 *
	 * This has to be considered when further processing the result
	 *
	 * @param incoming whether or not to consider incoming edges
	 * @param include_self contains a distance to itself?
	 * @param self_dist default distance to self
	 */
	adjMatrixW(incoming: boolean = false, include_self = false, self_dist = 0): MinAdjacencyListArray {
		let adjList = [],
			node_keys = Object.keys(this._g.getNodes());

		const adjDict = this.adjListW(incoming, include_self, self_dist);

		for (let i = 0; i < this._g.nrNodes(); ++i) {
			adjList.push([]);
			for (let j = 0; j < this._g.nrNodes(); ++j) {
				adjList[i].push(i === j ? self_dist : isFinite(adjDict[node_keys[i]][node_keys[j]]) ? adjDict[node_keys[i]][node_keys[j]] : Number.POSITIVE_INFINITY);
			}
		}
		return adjList;
	}


	/**
	 * @todo force directed / undirected
	 * 			 -> take undirected edge as 2 directed ones?
	 * 			 -> take directed edge as undirected?
	 *
	 * @param incoming whether or not to consider incoming edges
	 * @param include_self contains a distance to itself?
	 * @param self_dist default distance to self
	 */
	adjListW(incoming: boolean = false, include_self = false, self_dist = 0): MinAdjacencyListDict {
		let adj_list_dict: MinAdjacencyListDict = {},
			nodes = this._g.getNodes(),
			cur_dist: number,
			key: string,
			cur_edge_weight: number;

		for (key in nodes) {
			adj_list_dict[key] = {};
			if (include_self) {
				adj_list_dict[key][key] = self_dist;
			}
		}
		for (key in nodes) {
			let neighbors = incoming ? nodes[key].reachNodes().concat(nodes[key].prevNodes()) : nodes[key].reachNodes();

			neighbors.forEach((ne) => {
				cur_dist = adj_list_dict[key][ne.node.getID()] || Number.POSITIVE_INFINITY;
				cur_edge_weight = isNaN(ne.edge.getWeight()) ? DEFAULT_WEIGHT : ne.edge.getWeight();

				if (cur_edge_weight < cur_dist) {
					adj_list_dict[key][ne.node.getID()] = cur_edge_weight;

					if (incoming) { // we need to update the 'inverse' entry as well
						adj_list_dict[ne.node.getID()][key] = cur_edge_weight;
					}
				} else {
					adj_list_dict[key][ne.node.getID()] = cur_dist;

					if (incoming) {
						adj_list_dict[ne.node.getID()][key] = cur_dist;
					}
				}
			});
		}
		return adj_list_dict;
	}


	/**-------------------------------------------------------------
	 * 				Triad, triangle, CC & transitivity (global CC)
	 *				@todo refactor out into own module:
	 *				  - name: `general metrics` ?
	 *					- modularity / connectivity / CC & Trans
	 *-------------------------------------------------------------
	 */

	/**
	 * @description `triad`: is either a completed triangle or a potential triangle, 
	 * 							meaning a connection between 3 nodes that is lacking just 1 edge.
	 * 							`triplet`: is three nodes that are connected by either two (open triplet) 
	 * 							or three (closed triplet) undirected ties
	 * 							triad == triplet
	 * @description count all 2-triads
		* 					  UN-directed scenario for earch node: all pairwise connections could form a triangle
		* 					  directed scenario for each node: -ins could form triangles with -outs (and vice versa)
	 *
	 * @todo this only works for nodes without self-loops !!!
	 *
	 * @param directed directed or undirected
	 */
	triadCount(directed = false): number {
		let triangle_count = 0;
		const nodes = Object.values(this._g.getNodes());
		let deg;

		for ( let n of nodes ) {
			if ( directed ) {
				triangle_count += ( n.in_deg - n.self_in_deg ) * ( n.out_deg - n.self_out_deg );
			}
			else {
				deg = n.deg - n.self_deg;
				triangle_count += deg * ( deg - 1 ) / 2;
			}
		}
		return triangle_count;
	}


	/**
	 * @description how many triangles (A-B-C, or A->B->C) are there in the graph
	 * 							In directed graphs, each triangle is seen thrice (from A, B, C)
	 * 							In undirected graphs, each triangle is seen six times (from A, B, C, but each in 2 directions)
	 * @param directed directed or undirected network
	 */
	async triangleCount(directed = false): Promise<number> {
		this.checkNumericHandler();
		const adj_list = this.adjMatrix();
		const a = this._numeric.tensor2d(adj_list);
		const aux2 = await a.matMul(a).array();
		const aux3 = await a.matMul(aux2).array();
		// logger.log(aux3);

		let trace = 0;
		for (let i = 0; i < aux3.length; i++) {
			trace += aux3[i][i];
		}
		return directed ? trace / 3 : trace / 6;
	}


	/**
	 * @description transitivity (or global clustering coefficient, gCC) is the ratio
	 * 							of actual triangles to potential triangles, or
	 * 							(nr. of closed triplets / nr. of all triplets)
	 * 							It therefore measures the connection potential of the whole graph,
	 * 							the higher the gCC the lower the future connection potential.
	 * @description should equal the average (local) clustering coefficients of all nodes
	 * 
	 * @todo test that avg(lCC) == gCC
	 * @todo there are 4 different ways to define a triplet closure in DIRECTED graphs
	 * @todo using the `undirected` formula results are not consistent with networkx
	 * @todo research & correct the $G <-> networkx inconsistency
	 * @param directed directed or undirected network
	 */
	async globalCC(directed = false): Promise<number> {
		const triangles = await this.triangleCount(directed);
		const triads = this.triadCount(directed);
		return 3 * triangles / triads;
	}


	/**
	 * @description The CC (also `local` CC) measures how complete the neighborhood of a node is,
	 * 							i.e. (completed triangles / `potential` triangles), where a potential triangle
	 * 							could form by adding 1 edge between	hitherto unconnected neighbors.
	 * 							This can be measured by 							
	 * @param directed directed or undirected network
	 */
	async localCC(directed = false) : Promise<{[key: string]: number}> {
		this.checkNumericHandler();
		const result = {};
		const adj_list = this.adjMatrix();
		const a = this._numeric.tensor2d(adj_list);
		const aux2 = await a.matMul(a).array();
		const aux3 = await a.matMul(aux2).array();
		/**
		 * @todo ensure node order is equivalent to aux3 ordering - HOW ??
		 */
		let deg: number;
		let node: IBaseNode;
		let cc_i: number; // intermediate
		const keys = Object.keys(this._g.getNodes());

		for ( let i in aux3[0] ) {
			node = this._g.getNodeById(keys[i]);
			deg = directed ? node.in_deg + node.out_deg : node.deg;
			cc_i = (aux3[i][i] / (deg * (deg-1))) || 0;
			result[i] = directed ? 2 * cc_i : cc_i;
		}
		return result;
	}



}


export {
	ComputeGraph
}
