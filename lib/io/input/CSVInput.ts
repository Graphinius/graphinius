import * as fs from 'fs';
import * as path from 'path';

import * as $N from '@/core/base/BaseNode';
import * as $E from '@/core/base/BaseEdge';
import * as $G from '@/core/base/BaseGraph';


const DEFAULT_WEIGHT = 1;
const CSV_EXTENSION = ".csv";


export interface ICSVInConfig {
	separator?					: string;
	explicit_direction?	: boolean;
	direction_mode?			: boolean;
	weighted?						: boolean;
}


export interface ICSVInput {
	_config : ICSVInConfig;

	readFromAdjacencyListFile(filepath : string) : $G.IGraph;
	readFromAdjacencyList(input : Array<string>, graph_name : string) : $G.IGraph;
	
	readFromEdgeListFile(filepath : string) : $G.IGraph;
	readFromEdgeList(input : Array<string>, graph_name: string) : $G.IGraph;
}


class CSVInput implements ICSVInput {
	_config : ICSVInConfig;
	
	constructor( config: ICSVInConfig = {} ) {
		this._config = {
			separator: config.separator != null ? config.separator : ',',
			explicit_direction: config.explicit_direction != null ? config.explicit_direction : true,
			direction_mode: config.direction_mode != null ? config.direction_mode : false,
			weighted: config.weighted != null ? config.weighted : false
		};
	}
	
	readFromAdjacencyListFile(filepath : string) : $G.IGraph {
		return this.readFileAndReturn(filepath, this.readFromAdjacencyList);
	}
	

	readFromEdgeListFile(filepath : string) : $G.IGraph {
		return this.readFileAndReturn(filepath, this.readFromEdgeList);
	}
	
	
	private readFileAndReturn(filepath: string, func: Function) : $G.IGraph {
		let graph_name = path.basename(filepath);
		let input = fs.readFileSync(filepath).toString().split('\n');
		return func.apply(this, [input, graph_name]);
	}
			
	
	readFromAdjacencyList(input : Array<string>, graph_name : string) : $G.IGraph {
		let graph = new $G.BaseGraph(graph_name);
		
		for ( let idx in input ) {
			let line = input[idx],
					elements = this._config.separator.match(/\s+/g) ? line.match(/\S+/g) : line.replace(/\s+/g, '').split(this._config.separator),
					node_id = elements[0],
					node : $N.IBaseNode,
					edge_array = elements.slice(1),
					edge : $E.IBaseEdge,
					target_node_id : string,
					target_node : $N.IBaseNode,
					dir_char: string,
					directed: boolean,
					edge_id: string,
					edge_id_u2: string;
			
			if ( !node_id ) {
				// end of file or empty line, just treat like an empty line...
				continue;
			}
			node = graph.hasNodeID(node_id) ? graph.getNodeById(node_id) : graph.addNodeByID(node_id);
			
			for ( let e = 0; e < edge_array.length; ) {
				
				if ( this._config.explicit_direction && ( !edge_array || edge_array.length % 2 ) ) {
					throw new Error('Every edge entry has to contain its direction info in explicit mode.');
				}
				target_node_id = edge_array[e++];
				
				target_node = graph.hasNodeID(target_node_id) ? graph.getNodeById(target_node_id) : graph.addNodeByID(target_node_id);
				
				/**
				 * The direction determines if we have to check for the existence
				 * of an edge in 'both' directions or only from one node to the other
				 * Within the CSV module this check is done simply via ID check,
				 * as we are following a rigorous naming scheme anyways...
				 */
				dir_char = this._config.explicit_direction ? edge_array[e++] : this._config.direction_mode ? 'd' : 'u';
				
				if ( dir_char !== 'd' && dir_char !== 'u' ) {
					throw new Error("Specification of edge direction invalid (d and u are valid).");
				}
				directed = dir_char === 'd';
				
				edge_id = node_id + "_" + target_node_id + "_" + dir_char;
				edge_id_u2 = target_node_id + "_" + node_id + "_" + dir_char;	
								
				if ( graph.hasEdgeID(edge_id) || ( !directed && graph.hasEdgeID(edge_id_u2) ) ) {
					// The completely same edge should only be added once...
					continue;
				}
				else {
					edge = graph.addEdgeByID(edge_id, node, target_node, {directed: directed});
				}				
			}			
		}
		return graph;
	}
	
	
	readFromEdgeList(input : Array<string>, graph_name : string, weighted = false) : $G.IGraph {
		
		let graph = new $G.BaseGraph(graph_name);
		
		for ( let idx in input ) {
			let line = input[idx],
					elements = this._config.separator.match(/\s+/g) ? line.match(/\S+/g) : line.replace(/\s+/g, '').split(this._config.separator);
			
			if ( ! elements ) {
				// end of file or empty line, just treat like an empty line...
				continue;
			}
			
			if ( elements.length < 2 || elements.length > 3 ) {
				throw new Error('Edge list is in wrong format - every line has to consist of two entries (the 2 nodes)');
			}
			
			let	node_id = elements[0],
					node : $N.IBaseNode,
					target_node : $N.IBaseNode,
					edge : $E.IBaseEdge,
					target_node_id = elements[1],
					dir_char = this._config.explicit_direction ? elements[2] : this._config.direction_mode ? 'd' : 'u',
					directed: boolean,
					edge_id: string,
					edge_id_u2: string,
					parse_weight: number,
					edge_weight: number;
			
			node = graph.hasNodeID(node_id) ? graph.getNodeById(node_id) : graph.addNodeByID(node_id);
			target_node = graph.hasNodeID(target_node_id) ? graph.getNodeById(target_node_id) : graph.addNodeByID(target_node_id);
						
			if ( dir_char !== 'd' && dir_char !== 'u' ) {
				throw new Error("Specification of edge direction invalid (d and u are valid).");
			}
			directed = dir_char === 'd';
			
			edge_id = node_id + "_" + target_node_id + "_" + dir_char;
			edge_id_u2 = target_node_id + "_" + node_id + "_" + dir_char;
			
			parse_weight = parseFloat(elements[2]);
			edge_weight = this._config.weighted ? (isNaN(parse_weight) ? DEFAULT_WEIGHT : parse_weight) : null;


			/**
			 * @todo introduce Edge Dupe Checker and replace this logic
			 */
			if ( graph.hasEdgeID(edge_id) || ( !directed && graph.hasEdgeID(edge_id_u2) ) ) {
				continue;
			}
			else if (this._config.weighted) {
				edge = graph.addEdgeByID(edge_id, node, target_node, {directed: directed, weighted: true, weight: edge_weight});
			}
			else {
				edge = graph.addEdgeByID(edge_id, node, target_node, {directed: directed});
			}
		}
		
		return graph;
	}
	
	
}

export { 
	CSVInput
};