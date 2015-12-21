/// <reference path="../../typings/tsd.d.ts" />

import _ 		= require('lodash');
import fs		= require('fs');
import path = require('path');

import * as $N from '../core/Nodes';
import * as $E from '../core/Edges';
import * as $G from '../core/Graph';

interface JSONNode {
	edges: Array<string>;
}

interface JSONGraph {
	name			: string;
	nodes			: number;
	edges			: number;
	data			: {[key:string] : JSONNode}
}

interface IJSONInput {	
	readFromJSONFile(file : string) : $G.IGraph;
	readFromJSON(json : {}) : $G.IGraph;
}


class JSONInput implements IJSONInput {
	
	constructor() {		
	}
	
	readFromJSONFile(filepath : string) : $G.IGraph {
		this.checkNodeEnvironment();

		var json = JSON.parse(fs.readFileSync(filepath).toString());
		return this.readFromJSON(json);
	}
	
	/**
	 * In this case, there is one great difference to the CSV edge list cases:
	 * If you don't explicitly define a directed edge, it will simply 
	 * instantiate an undirected one
	 * we'll leave that for now, as we will produce apt JSON sources later anyways...
	 */
	readFromJSON(json : JSONGraph) : $G.IGraph {
		var graph = new $G.BaseGraph(json.name);
		for ( var node_id in json.data ) {
			var node = graph.hasNodeID(node_id) ? graph.getNodeById(node_id) : graph.addNode(node_id);
			var edges = json.data[node_id].edges	
			for ( var e in edges ) {
				var edge_input = String(edges[e]).match(/\S+/g),
						target_node_id = edge_input[0],
						dir_char = edge_input[1],
						directed = dir_char === 'd',
						target_node = graph.hasNodeID(target_node_id) ? graph.getNodeById(target_node_id) : graph.addNode(target_node_id);
						
				var edge_id = node_id + "_" + target_node_id + "_" + dir_char,
						edge_id_u2 = target_node_id + "_" + node_id + "_" + dir_char;		
								
				if ( graph.hasEdgeID(edge_id) || ( !directed && graph.hasEdgeID(edge_id_u2) ) ) {
					// The completely same edge should only be added once...
					continue;
				}
				else {
					var edge = graph.addEdge(edge_id, node, target_node, {directed: directed});
				}
			}
		}		
		return graph;
	}
	
	private checkNodeEnvironment() : void {
		if ( !global ) {
			throw new Error('Cannot read file in browser environment.');
		}
	}
	
}

export {IJSONInput, JSONInput};