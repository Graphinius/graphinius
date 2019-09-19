import {ClusteringCoefs, MinAdjacencyListArray, MinAdjacencyListDict, NextArray} from "../interfaces";
import {IGraph} from "../base/BaseGraph";


const DEFAULT_WEIGHT = 1;


export interface IComputeGraph {
	// REPRESENTATIONS
	adjListDict(incoming?: boolean, include_self?, self_dist?: number): MinAdjacencyListDict;
	adjListArray(incoming?: boolean): MinAdjacencyListArray;
	nextArray(incoming?: boolean): NextArray;

	// ANALYSIS
	readonly clustCoef: ClusteringCoefs;
}


class ComputeGraph implements IComputeGraph {

	private adj_list_uu : Uint32Array;
	private adj_list_du : Uint32Array;
	private adj_list_uw : Float32Array;
	private adj_list_dw : Float32Array;


	constructor(private _g: IGraph, private _tf?: any) {

	}


	/**
	 * @param incoming
	 * @todo analyze and make faster
	 */
	nextArray(incoming: boolean = false): NextArray {
		let next = [],
			node_keys = Object.keys(this._g.getNodes());

		const adjDict = this.adjListDict(incoming, true, 0);

		for (let i = 0; i < this._g.nrNodes(); ++i) {
			next.push([]);
			for (let j = 0; j < this._g.nrNodes(); ++j) {
				next[i].push([]);

				next[i][j].push(i === j ? j : isFinite(adjDict[node_keys[i]][node_keys[j]]) ? j : null);
			}
		}
		return next;
	}


	/**
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
	adjListArray(incoming: boolean = false, include_self = false, self_dist = 0): MinAdjacencyListArray {
		let adjList = [],
			node_keys = Object.keys(this._g.getNodes());

		const adjDict = this.adjListDict(incoming, include_self, self_dist);

		for (let i = 0; i < this._g.nrNodes(); ++i) {
			adjList.push([]);
			for (let j = 0; j < this._g.nrNodes(); ++j) {
				adjList[i].push(i === j ? self_dist : isFinite(adjDict[node_keys[i]][node_keys[j]]) ? adjDict[node_keys[i]][node_keys[j]] : Number.POSITIVE_INFINITY);
			}
		}
		return adjList;
	}


	/**
	 *
	 * @param incoming whether or not to consider incoming edges
	 * @param include_self contains a distance to itself?
	 * @param self_dist default distance to self
	 */
	adjListDict(incoming: boolean = false, include_self = false, self_dist = 0): MinAdjacencyListDict {
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
				}
				else {
					adj_list_dict[key][ne.node.getID()] = cur_dist;

					if (incoming) {
						adj_list_dict[ne.node.getID()][key] = cur_dist;
					}
				}
			});
		}
		return adj_list_dict;
	}


	get clustCoef(): ClusteringCoefs {
		if ( !this._tf || !this._tf.matMul ) {
			throw new Error("Tensorflow & TF matMul function must be present in order to compute clustering coef.");
		}

		const cc: ClusteringCoefs = {global_und: null, global_dir: null};
		const adj_list = this.adjListArray();
		console.log(adj_list);

		let aux2, aux3;
		this._tf.matMul(adj_list, adj_list).data().then(res => aux2 = res);
		this._tf.matMul(adj_list, aux2).data().then(res => aux3 = res);
		console.log(aux3);
		return cc;
	}

}


export {
	ComputeGraph
}

