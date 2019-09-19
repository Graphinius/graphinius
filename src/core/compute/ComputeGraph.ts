import {MinAdjacencyListArray, MinAdjacencyListDict, NextArray} from "../interfaces";
import {IGraph} from "../base/BaseGraph";

import {Logger} from "../../utils/Logger";
const logger = new Logger();

const DEFAULT_WEIGHT = 1;


export interface IComputeGraph {
	// REPRESENTATIONS
	adjListW(incoming?: boolean, include_self?, self_dist?: number): MinAdjacencyListDict;

	adjMatrix(): MinAdjacencyListArray;

	adjMatrixW(incoming?: boolean): MinAdjacencyListArray;

	nextArray(incoming?: boolean): NextArray;

	// ANALYSIS
	triadCount(directed?: boolean): number;

	triangleCount(directed?: boolean): Promise<number>;

	transitivity(directed?: boolean): Promise<number>;

	clustCoef(directed? : boolean) : Promise<{[key: string]: number}>;
}


class ComputeGraph implements IComputeGraph {

	private adj_list_uu: Uint32Array;
	private adj_list_du: Uint32Array;
	private adj_list_uw: Float32Array;
	private adj_list_dw: Float32Array;


	constructor(private _g: IGraph, private _tf?: any) {
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


	/**
	 * @todo there are 4 different ways to define a triplet closure in DIRECTED graphs
	 * 			 -> using the `undirected` formula (transitivity) is not consistent with networkx
	 * 			 -> do I care ???
	 * @param directed
	 */
	async transitivity(directed = false): Promise<number> {
		const triangles = await this.triangleCount(directed);
		const triads = this.triadCount(directed);
		return 3 * triangles / triads;
	}


	/**
	 * @todo check necessity of the reverse conditions in the `directed` case
	 *
	 * @param directed
	 */
	triadCount(directed = false): number {
		let triangle_count = 0;
		const dupes_set = new Set<string>();
		const edges = directed ? Object.values(this._g.getDirEdges()) : Object.values(this._g.getUndEdges());

		let ia, ib, ja, jb, path_id;

		for (let i of edges) {
			for (let j of edges) {
				if ( i === j ) {
					continue;
				}

				ia = i.getNodes().a;
				ib = i.getNodes().b;
				ja = j.getNodes().a;
				jb = j.getNodes().b;

				// logger.log(`${i.id} -- ${j.id}`);

				// loops
				if ( ia === ib || ja === jb ) {
					continue;
				}
				// In 'order'...
				if ( ib === ja && ia !== jb ) {
					path_id = `${ia.id}-${ib.id}-${jb.id}`;
					if ( !dupes_set.has(path_id) && !dupes_set.has(path_id.split('-').reverse().join('-')) ) {
						dupes_set.add(path_id);
						triangle_count++;
					}
				}
				if ( !directed ) {
					// Spread 1
					if ( ia === ja && ib !== jb ) {
						path_id = `${ib.id}-${ia.id}-${jb.id}`;
						if ( !dupes_set.has(path_id) && !dupes_set.has(path_id.split('-').reverse().join('-')) ) {
							dupes_set.add(path_id);
							triangle_count++;
						}
					}
					// Spread 2
					if ( ib === jb && ia !== ja ) {
						path_id = `${ia.id}-${ib.id}-${ja.id}`;
						if ( !dupes_set.has(path_id) && !dupes_set.has(path_id.split('-').reverse().join('-')) ) {
							dupes_set.add(path_id);
							triangle_count++;
						}
					}
				}
			}
		}
		// logger.log('Dupes Set: ', dupes_set);

		return triangle_count;
	}


	async triangleCount(directed = false): Promise<number> {
		if (!this._tf || !this._tf.matMul) {
			throw new Error("Tensorflow & TF matMul function must be present in order to compute transitivity.");
		}

		const adj_list = this.adjMatrix();
		// logger.log(adj_list);

		const a = this._tf.tensor2d(adj_list);

		const aux2 = await a.matMul(a).array();
		// logger.log(aux2);

		const aux3 = await a.matMul(aux2).array();
		// logger.log(aux3);

		let trace = 0;
		for (let i = 0; i < aux3.length; i++) {
			trace += aux3[i][i];
		}
		return directed ? trace / 3 : trace / 6;
	}


	async clustCoef(directed = false) : Promise<{[key: string]: number}> {
		if (!this._tf || !this._tf.matMul) {
			throw new Error("Tensorflow & TF matMul function must be present in order to compute clustering coef.");
		}
		const result = {};
		const adj_list = this.adjMatrix();
		const a = this._tf.tensor2d(adj_list);
		const aux2 = await a.matMul(a).array();
		const aux3 = await a.matMul(aux2).array();
		/**
		 * @todo check if node order is equivalent to aux3 ordering
		 */
		let deg: number;
		const keys = Object.keys(this._g.getNodes());
		for ( let i in aux3[0] ) {
			deg = this._g.getNodeById(keys[i]).degree();
			result[i] = (aux3[i][i] / (deg * (deg-1))) || 0;
		}
		return result;
	}

}


export {
	ComputeGraph
}

