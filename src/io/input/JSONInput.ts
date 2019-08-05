import * as fs from 'fs';
import { IBaseEdge } from '../../core/base/BaseEdge';
import { IGraph, BaseGraph } from '../../core/base/BaseGraph';
import * as $R from '../../utils/RemoteUtils';
import { labelKeys } from '../interfaces';
import { PotentialEdgeInfo, EdgeDupeChecker } from '../common/Dupes';

import * as uuid from 'uuid'
const v4 = uuid.v4;

import { Logger } from '../../utils/Logger';
const logger = new Logger();


const DEFAULT_WEIGHT: number = 1;


export interface JSONEdge {
	to				: string;
	directed?	: string;
	weight?		: string;
	type?			: string;
}


export interface JSONNode {
	edges			: Array<JSONEdge>;
	coords?		: { [key: string]: Number };
	features?	: { [key: string]: any };
}


export interface JSONGraph {
	name		: string;
	nodes		: number;
	edges		: number;
	data		: { [key: string]: JSONNode }
}


export interface IJSONInConfig {
	explicit_direction?		: boolean;
	directed?							: boolean;
	weighted?							: boolean;
	typed?								:	boolean;
}


export interface IJSONInput {
	_config: IJSONInConfig;

	readFromJSONFile(file: string, graph?: IGraph): IGraph;
	readFromJSON(json: {}, graph?: IGraph): IGraph;
	readFromJSONURL(config: $R.RequestConfig, cb: Function, graph?: IGraph): void;
}


class JSONInput implements IJSONInput {
	_config: IJSONInConfig;	

	constructor(config?: IJSONInConfig) {
		this._config = config || {
			explicit_direction: config && config.explicit_direction || true,
			directed: config && config.directed || false,
			weighted: config && config.weighted || false
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


	/**
	 * @description Works with Basegraph, Basenodes, Baseedges
	 *
	 * @todo extend / re-write for Typed Entities
	 * 			 -> NAH, correct graph type should do it
	 * 			 -> just include all relevant addNode/Edge methods...
	 *
	 * @param json
	 * @param graph
	 */
	readFromJSON(json: JSONGraph, graph?: IGraph): IGraph {
		graph = graph || new BaseGraph(json.name);
		const edc = new EdgeDupeChecker(graph);

		let coords_json: { [key: string]: any },
			coords: { [key: string]: Number },
			coord_idx: string,
			features: { [key: string]: any };

		for (let node_id in json.data) {
			let node = graph.addNodeByID(node_id);
			let label = json.data[node_id][labelKeys.label];
			if (label) {
				node.setLabel(label);
			}
			/**
			 * Reading and instantiating features
			 * We are using the shortcut setFeatures here,
			 * so we have to read them before any special features
			 *
			 * @description assignment is intentional
			 */
			if (features = json.data[node_id][labelKeys.features]) {
				/**
				 * Since we are reading from an 'offline' source, we
				 * can simply use the reference...
				 */
				node.setFeatures(features);
			}

			/**
			 * Reading and instantiating coordinates
			 * Coordinates are treated as special features,
			 * and are therefore added after general features
			 *
			 * @description assignment is intentional
			 */
			if (coords_json = json.data[node_id][labelKeys.coords]) {
				coords = {};
				for (coord_idx in coords_json) {
					coords[coord_idx] = +coords_json[coord_idx];
				}
				node.setFeature(labelKeys.coords, coords);
			}
		}



		/**
		 * ROUND 2 - Add edges if no dupes
		 */
		for (let node_id in json.data) {
			logger.log(node_id);
			let node = graph.getNodeById(node_id);

			// Reading and instantiating edges
			let edges = json.data[node_id][labelKeys.edges];
			for (let e in edges) {
				let edge_input = edges[e],
					edge_label = edge_input[labelKeys.e_label],
					target_node_id = edge_input[labelKeys.e_to],

					// Is there any direction information?            
					directed = this._config.explicit_direction ? !!edge_input[labelKeys.e_dir] : this._config.directed,
					dir_char = directed ? 'd' : 'u',

					// Is there any weight information?,
					/**
					 * @todo reverse this
					 */
					weight_float = JSONInput.handleEdgeWeights(edge_input),
					weight_info = weight_float === weight_float ? weight_float : DEFAULT_WEIGHT,
					edge_weight = this._config.weighted ? weight_info : undefined,
					target_node = graph.hasNodeID(target_node_id) ? graph.getNodeById(target_node_id) : graph.addNodeByID(target_node_id);


				/* --------------------------------------------------- */
				/*							DUPLICATE EDGE HANDLING								 */
				/* --------------------------------------------------- */
				const ne: PotentialEdgeInfo = {
					a: node,
					b: target_node,
					dir: directed,
					weighted: !!edge_weight,
					weight: edge_weight,
					typed: true,
					type: edge_label // label OR type
				};
				logger.log(`${ne.a.id} | ${ne.b.id} | ${ne.dir}`);

				if ( !edc.isDupe(ne) ) {
					graph.addEdgeByID(v4(), ne.a, ne.b, {
						directed: ne.dir,
						weighted: ne.weighted,
						weight: ne.weight,
						typed: ne.typed,
						type: ne.type
					});
				}
			}
		}
		return graph;
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

export { JSONInput }
