/// <reference path="../../typings/tsd.d.ts" />

import _ = require('lodash');
import fs = require('fs');
import path = require('path');

import * as $N from '../core/Nodes';
import * as $E from '../core/Edges';
import * as $G from '../core/Graph';

interface ICSVInput {
	_separator: string;
	// setSeparator(sep: string) : void;
	
	readFromAdjacenyList(file : string) : $G.IGraph;
}

class CSVInput implements ICSVInput {
	
	constructor(public _separator : string = ',') {		
	}
	
	
	readFromAdjacenyList(filepath : string) : $G.IGraph {
		// TODO: need proper test case for environment checks...
		this.checkNodeEnvironment();
		
		var graph_name = path.basename(filepath);
		var graph = new $G.BaseGraph(graph_name);		
		var input = fs.readFileSync(filepath).toString().split('\n');
		
		for ( var idx in input ) {
			var line = input[idx],
					elements = this._separator.match(/\s+/g) ? line.match(/\S+/g) : line.replace(/\s+/g, '').split(this._separator),
					node_id = elements[0],
					node : $N.IBaseNode,
					edge_array = elements.slice(1),
					edge : $E.IBaseEdge,
					edge_target_id : string,
					edge_target : $N.IBaseNode,
					dir_char: string,
					directed: boolean,
					edge_id: string,
					edge_id_u2: string;
			
			if ( !node_id ) {
				// We have just seen the last line...
				return graph;
			}
			if ( graph.hasNodeID(node_id) ) {
				node = graph.getNodeById(node_id);
			}
			else {
				node = graph.addNode(node_id);
			}
			for ( var e = 0; e < edge_array.length; ) {
				
				if ( !edge_array || edge_array.length % 2 ) {
					throw new Error('Wrong edge description found in file.');
				}
				edge_target_id = edge_array[e++];
				
				// does target node exist?
				if ( graph.hasNodeID(edge_target_id) ) {
					edge_target = graph.getNodeById(edge_target_id);
				}
				else {
					edge_target = graph.addNode(edge_target_id);
				}
								
				/**
				 * The direction determines if we have to check for the existence
				 * of an edge in 'both' directions or only from one node to the other
				 * Within the CSV module this check is done simply via ID check,
				 * as we are following a rigorous naming scheme anyways...
				 */
				dir_char = edge_array[e++];
				
				// console.log("EDGE ARRAY: " + edge_array);
				// console.log("EDGE HAS DIRECTION: " + dir_char);
				
				if ( dir_char !== 'd' && dir_char !== 'u' ) {
					throw new Error("Specification of edge direction invalid (d and u are valid).");
				}
				directed = dir_char === 'd';
				
				edge_id = node_id + edge_target_id + dir_char;
				edge_id_u2 = edge_target_id + node_id + dir_char;		
								
				if ( graph.hasEdgeID(edge_id) || ( !directed && graph.hasEdgeID(edge_id_u2) ) ) {
					// The completely same edge should only be added once...
					continue;
				}
				else {
					edge = graph.addEdge(edge_id, node, edge_target, {directed: directed});
				}
				
			}
			
		}
		return graph;
	}
	
	
	private checkNodeEnvironment() : void {
		if ( !fs ) {
			throw new Error('Cannot read file in browser environment.');
		}
	}
	
}

export {ICSVInput, CSVInput};