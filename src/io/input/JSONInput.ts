import * as fs from 'fs';
import path = require('path');

import * as $G from '../../core/Graph';
import * as $R from '../../utils/RemoteUtils';
import { Logger } from '../../utils/Logger';
const logger = new Logger();

const DEFAULT_WEIGHT: number = 1;
const JSON_EXTENSION = ".json";


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
	explicit_direction?: boolean;
	directed?: boolean; // true => directed
	weighted?: boolean;
}


export interface IJSONInput {
	_config: IJSONInConfig;

	readFromJSONFile(file: string): $G.IGraph;
	readFromJSON(json: {}): $G.IGraph;
	readFromJSONURL(config: $R.RequestConfig, cb: Function): void;
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

	readFromJSONFile(filepath: string): $G.IGraph {
		$R.checkNodeEnvironment();

		// TODO test for existing file...
		var json = JSON.parse(fs.readFileSync(filepath).toString());
		return this.readFromJSON(json);
	}

	readFromJSONURL(config: $R.RequestConfig, cb: Function): void {
		var self = this,
			graph: $G.IGraph,
			request,
			json: JSON;

		// Assert we are in Node.js environment
		$R.checkNodeEnvironment();

		// Node.js
		$R.retrieveRemoteFile(config, function (raw_graph) {
			graph = self.readFromJSON(JSON.parse(raw_graph));
			cb(graph, undefined);
		});	
	}

	/**
	 * In this case, there is one great difference to the CSV edge list cases:
	 * If you don't explicitly define a directed edge, it will simply 
	 * instantiate an undirected one
	 * we'll leave that for now, as we will produce apt JSON sources later anyways...
	 */
	readFromJSON(json: JSONGraph): $G.IGraph {
		var graph: $G.IGraph = new $G.BaseGraph(json.name),
			coords_json: { [key: string]: any },
			coords: { [key: string]: Number },
			coord_idx: string,
			coord_val: number,
			features: { [key: string]: any },
			feature: string;

		for (var node_id in json.data) {
			var node = graph.hasNodeID(node_id) ? graph.getNodeById(node_id) : graph.addNodeByID(node_id);
			let label = json.data[node_id]['label'];
			if ( label ) {
				node.setLabel(label);
			}
			/**
			 * Reading and instantiating features
			 * We are using the shortcut setFeatures here,
			 * so we have to read them before any special features
			 */
			if (features = json.data[node_id].features) {
				// for ( feature in features ) {
				// 	node.setFeature(feature, features[feature]);
				// }
				node.setFeatures(features);
			}

			/**
			 * Reading and instantiating coordinates
			 * Coordinates are treated as special features,
			 * and are therefore added after general features
			 */
			if (coords_json = json.data[node_id].coords) {
				coords = {};
				for (coord_idx in coords_json) {
					coords[coord_idx] = +coords_json[coord_idx];
				}
				node.setFeature('coords', coords);
			}

			// Reading and instantiating edges
			var edges = json.data[node_id].edges;
			for (let e in edges) {
				let edge_input = edges[e],
					target_node_id = edge_input.to,

					// Is there any direction information?            
					directed = this._config.explicit_direction ? edge_input.directed : this._config.directed,
					dir_char = directed ? 'd' : 'u',

					// Is there any weight information?,
					weight_float = this.handleEdgeWeights(edge_input),
					weight_info = weight_float === weight_float ? weight_float : DEFAULT_WEIGHT,
					edge_weight = this._config.weighted ? weight_info : undefined,
					target_node = graph.hasNodeID(target_node_id) ? graph.getNodeById(target_node_id) : graph.addNodeByID(target_node_id);

				let edge_id = node_id + "_" + target_node_id + "_" + dir_char,
					edge_id_u2 = target_node_id + "_" + node_id + "_" + dir_char;
				// logger.log(`Edge ID: ${edge_id}, edge ID 2: ${edge_id_u2} `)

				/**
				 * @todo The completely same edge should only be added once...
				 * 
				 * @comment above: thats true! however with this you are not checking
				 * for identical edges! consider the case of undirected edges:
				 * if two undirected edges with ids a_b_u and b_a_u exists that have
				 * different properties (e.g. edge weights), this would lead to 
				 * ambiguous behaviour! which edge will be kept and which one rejected?
				 * There should be another way of handeling this!
				 * Proposed solution: dont allow this kind of input! => Throw Error!
				 * 
				 * Rules:
				 * 
				 * 1) duplicate edge ID is forbidden => because of Hash Map !
				 * 2) several undirected edges between nodes are [ allowed | fobidden ] !?
				 */
				if (graph.hasEdgeID(edge_id)) {
					continue;
				}

				if ((!directed && graph.hasEdgeID(edge_id_u2))) {
					if (this._config.weighted) {
						let edge = graph.getEdgeById(edge_id_u2);
						if (edge_weight != edge.getWeight()) {
							throw new Error('Input JSON flawed! Found duplicate edge with different weights!');
						}
					}
					continue;
				}
				else {
					var edge = graph.addEdgeByID(edge_id, node, target_node, {
						directed: directed,
						weighted: this._config.weighted,
						weight: edge_weight
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
	private handleEdgeWeights(edge_input): number {
		switch (edge_input.weight) {
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
				return parseFloat(edge_input.weight)
		}
	}

}

export { JSONInput }