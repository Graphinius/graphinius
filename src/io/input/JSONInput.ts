import * as fs from 'fs';
import {IBaseEdge} from '../../core/base/BaseEdge';
import {IBaseNode} from "../../core/base/BaseNode";
import {ITypedNode} from "../../core/typed/TypedNode";
import {IGraph, BaseGraph} from '../../core/base/BaseGraph';
import * as $R from '../../utils/RemoteUtils';
import {labelKeys} from '../interfaces';
import {EdgeDupeChecker, PotentialEdgeInfo} from '../common/Dupes';

import * as uuid from 'uuid'

const v4 = uuid.v4;

import {Logger} from '../../utils/Logger';
import {TypedGraph} from "../../core/typed/TypedGraph";

const logger = new Logger();


const DEFAULT_WEIGHT: number = 1;


export interface JSONEdge {
	to: string;
	directed?: string;
	weight?: string;
	type?: string;
}


export interface JSONNode {
	edges: Array<JSONEdge>;
	coords?: { [key: string]: Number };
	features?: { [key: string]: any };
}


export interface JSONGraph {
	name: string;
	nodes: number;
	edges: number;
	data: { [key: string]: JSONNode }
}


export interface IJSONInConfig {
	explicit_direction?		: boolean;
	directed?							: boolean;
	weighted?							: boolean;
	typed?								: boolean;
	dupeCheck? 						: boolean;
}


export interface IJSONInput {
	_config: IJSONInConfig;

	readFromJSONFile(file: string, graph?: IGraph): IGraph;

	readFromJSON(json: {}, graph?: IGraph): IGraph;

	readFromJSONURL(config: $R.RequestConfig, cb: Function, graph?: IGraph): void;
}


class JSONInput implements IJSONInput {
	_config: IJSONInConfig;

	constructor(config: IJSONInConfig = {}) {
		this._config = {
			explicit_direction: config.explicit_direction != null ? config.explicit_direction : true,
			directed: config.directed != null ? config.directed : false,
			weighted: config.weighted != null ? config.weighted : false,
			dupeCheck: config.dupeCheck != null ? config.dupeCheck : true
		};
	}


	readFromJSONFile(filepath: string, graph?: IGraph): IGraph {
		$R.checkNodeEnvironment();

		// TODO test for existing file...
		let json = JSON.parse(fs.readFileSync(filepath).toString());
		return this.readFromJSON(json, graph);
	}


	readFromJSONURL(config: $R.RequestConfig, cb: Function, graph?: IGraph): void {
		const self = this;

		// Assert we are in Node.js environment
		$R.checkNodeEnvironment();

		// Node.js
		$R.retrieveRemoteFile(config, function (raw_graph) {
			graph = self.readFromJSON(JSON.parse(raw_graph), graph);
			cb(graph, undefined);
		});
	}


	readFromJSON(json: JSONGraph, graph?: IGraph | TypedGraph): IGraph | TypedGraph {
		graph = graph || new BaseGraph(json.name);
		const edc = new EdgeDupeChecker(graph);

		this.addNodesToGraph(json, graph);

		for (let node_id in json.data) {
			let node = graph.getNodeById(node_id);

			// Reading and instantiating edges
			let edges = json.data[node_id][labelKeys.edges];
			for (let e in edges) {
				const edge_input = edges[e];
				// BASE INFO
				const target_node = this.getTargetNode(graph, edge_input);
				const edge_label = edge_input[labelKeys.e_label];
				const edge_type = edge_input[labelKeys.e_type];

				// DIRECTION
				const directed = this._config.explicit_direction ? !!edge_input[labelKeys.e_dir] : this._config.directed;

				// WEIGHTS
				const weight_float = JSONInput.handleEdgeWeights(edge_input);
				const weight_info = weight_float === weight_float ? weight_float : DEFAULT_WEIGHT;
				const edge_weight = this._config.weighted ? weight_info : undefined;

				// EDGE_ID creation
				/**
				 * @todo replace with uuid v4() -> then clean up the mess... ;-)
				 */
				const target_node_id = edge_input[labelKeys.e_to];
				const dir_char = directed ? 'd' : 'u';
				const edge_id = node_id + "_" + target_node_id + "_" + dir_char;

				// DUPLICATE or CREATE ??
				const newEdge: PotentialEdgeInfo = {
					a: node,
					b: target_node,
					label: edge_label,
					dir: directed,
					weighted: this._config.weighted,
					weight: edge_weight,
					typed: !!edge_type,
					type: edge_type
				};
				if ( this._config.dupeCheck && edc.isDupe(newEdge) ) {
					// Don't throw, just log
					logger.log(`Edge ${edge_label} is a duplicate according to assumptions... omitting.`);
					continue;
				}
				graph.addEdgeByID(edge_id, node, target_node, {
					label: edge_label,
					directed: directed,
					weighted: this._config.weighted,
					weight: edge_weight,
					typed: !!edge_type,
					type: edge_type
				});
			}
		}
		return graph;
	}


	addNodesToGraph(json: JSONGraph, graph: IGraph) {
		let
			coords_json: { [key: string]: any },
			coords: { [key: string]: Number },
			coord_idx: string,
			features: { [key: string]: any };

		for (let node_id in json.data) {
			const type = BaseGraph.isTyped(graph) ? json.data[node_id][labelKeys.n_type] : null;
			const label = json.data[node_id][labelKeys.n_label];
			const node = graph.addNodeByID(node_id, {label, type});
			// Here we set the reference...?
			features = json.data[node_id][labelKeys.n_features];
			if (features) {
				node.setFeatures(features);
			}
			// Here we copy...?
			coords_json = json.data[node_id][labelKeys.coords];
			if (coords_json) {
				coords = {};
				for (coord_idx in coords_json) {
					coords[coord_idx] = +coords_json[coord_idx];
				}
				node.setFeature(labelKeys.coords, coords);
			}
		}
	}


	/**
	 * @todo implicitly add nodes referenced by edge
	 *       but not present in graph input JSON ?
	 */
	getTargetNode(graph, edge_input): IBaseNode | ITypedNode {
		const target_node_id = edge_input[labelKeys.e_to];
		const target_node = graph.getNodeById(target_node_id);
		if (!target_node) {
			throw new Error('Node referenced by edge does not exist');
		}
		return target_node;
	}


	/**
	 * Infinity & -Infinity cases are redundant, as JavaScript
	 * handles them correctly anyways (for now)
	 * @param edge_input
	 */
	static handleEdgeWeights(edge_input): number {
		switch (edge_input[labelKeys.e_weight]) {
			case "undefined":
				return DEFAULT_WEIGHT;
			case "Infinity":
				return Number.POSITIVE_INFINITY;
			case "-Infinity":
				return Number.NEGATIVE_INFINITY;
			case "MAX":
				return Number.MAX_VALUE;
			case "MIN":
				return Number.MIN_VALUE;
			default:
				return parseFloat(edge_input[labelKeys.e_weight])
		}
	}
}

export {JSONInput}
