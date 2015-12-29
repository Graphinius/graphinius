/// <reference path="../../typings/tsd.d.ts" />

import _ 		= require('lodash');
import fs 	= require('fs');
import path = require('path');

import * as $N from '../core/Nodes';
import * as $E from '../core/Edges';
import * as $G from '../core/Graph';


interface ICSVInput {
	_separator					: string;
	_explicit_direction	: boolean;
	_direction_mode			: boolean; // true => directed
	
	readFromAdjacencyListFile(filepath : string) : $G.IGraph;
	readFromAdjacencyList(graph : $G.IGraph, input : Array<string>) : $G.IGraph;
	readFromAdjacencyListURL(fileurl : string, cb : Function);
	
	readFromEdgeListFile(filepath : string) : $G.IGraph;
	readFromEdgeList(graph : $G.IGraph, input : Array<string>) : $G.IGraph;
	readFromEdgeListURL(fileurl : string, cb : Function);
}

class CSVInput implements ICSVInput {
	
	constructor(public _separator: string = ',',
							public _explicit_direction: boolean = true,
							public _direction_mode: boolean = false) {		
	}
	
	
	readFromAdjacencyListURL(fileurl : string, cb : Function) {
		this.readGraphFromURL(fileurl, cb, this.readFromAdjacencyList);
	}
	
	
	readFromEdgeListURL(fileurl : string, cb : Function) {
		this.readGraphFromURL(fileurl, cb, this.readFromEdgeList);
	}
	
	
	private readGraphFromURL(fileurl: string, cb: Function, localFun: Function) {	
		var self = this;
		var graph_name = path.basename(fileurl);
		var graph : $G.IGraph = new $G.BaseGraph(graph_name);
		var request;
		// Node or browser ??
		if ( typeof window !== 'undefined' ) {
			// Browser...
			request = new XMLHttpRequest();			
			request.onreadystatechange = function() {
					if (request.readyState == 4 && request.status == 200) {
						var input = request.responseText.split('\n');
						graph = localFun.apply(self, [graph, input]);
						cb(graph, undefined);
					}
			};
			request.open("GET", fileurl, true);
			request.setRequestHeader('Content-Type', 'text/csv; charset=ISO-8859-1');
			request.send();
		}
		else {
			// Node.js
			request = require('request');
			request({
				url: fileurl,
				json: false
			}, function (err, res, input) {		
				if (!err && res.statusCode === 200) {
						// Deal with the CSV response
						input = input.toString().split('\n');
						graph = localFun.apply(self, [graph, input]);
						cb(graph, undefined);
				}
			});
		}
	}
	
	
	readFromAdjacencyListFile(filepath : string) : $G.IGraph {
		return this.readFileAndReturn(filepath, this.readFromAdjacencyList);
	}
	

	readFromEdgeListFile(filepath : string) : $G.IGraph {
		return this.readFileAndReturn(filepath, this.readFromEdgeList);
	}
	
	
	private readFileAndReturn(filepath: string, func: Function) : $G.IGraph {
		this.checkNodeEnvironment();
		var graph_name = path.basename(filepath);
		var graph = new $G.BaseGraph(graph_name);
		var input = fs.readFileSync(filepath).toString().split('\n');
		return func.apply(this, [graph, input]);
	}
			
	
	readFromAdjacencyList(graph : $G.IGraph, input : Array<string>) : $G.IGraph {
		
		for ( var idx in input ) {
			var line = input[idx],
					elements = this._separator.match(/\s+/g) ? line.match(/\S+/g) : line.replace(/\s+/g, '').split(this._separator),
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
				// We have just seen the last line...
				return graph;
			}
			node = graph.hasNodeID(node_id) ? graph.getNodeById(node_id) : graph.addNode(node_id);
			
			for ( var e = 0; e < edge_array.length; ) {
				
				if ( this._explicit_direction && ( !edge_array || edge_array.length % 2 ) ) {
					throw new Error('Wrong edge description found in file.');
				}
				target_node_id = edge_array[e++];				
				
				target_node = graph.hasNodeID(target_node_id) ? graph.getNodeById(target_node_id) : graph.addNode(target_node_id);
				
				/**
				 * The direction determines if we have to check for the existence
				 * of an edge in 'both' directions or only from one node to the other
				 * Within the CSV module this check is done simply via ID check,
				 * as we are following a rigorous naming scheme anyways...
				 */
				dir_char = this._explicit_direction ? edge_array[e++] : this._direction_mode ? 'd' : 'u';
				
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
					edge = graph.addEdge(edge_id, node, target_node, {directed: directed});
				}				
			}			
		}
		return graph;
	}
	
	
	readFromEdgeList(graph : $G.IGraph, input : Array<string>) : $G.IGraph {
				
		for ( var idx in input ) {
			var line = input[idx],
					elements = this._separator.match(/\s+/g) ? line.match(/\S+/g) : line.replace(/\s+/g, '').split(this._separator);
			
			if ( ! elements ) {
				// end of file (empty line)
				return graph;
			}
			
			if ( elements.length < 2 ) {
				throw new Error('Edge list is in wrong format - every line has to consist of two entries (the 2 nodes)');
			}
			
			var	node_id = elements[0],
					node : $N.IBaseNode,
					target_node : $N.IBaseNode,
					edge : $E.IBaseEdge,
					target_node_id = elements[1],
					dir_char = this._explicit_direction ? elements[2] : this._direction_mode ? 'd' : 'u',
					directed: boolean,
					edge_id: string,
					edge_id_u2: string;
			
			if ( !node_id ) {
				// We have just seen the last line...
				return graph;
			}
			
			node = graph.hasNodeID(node_id) ? graph.getNodeById(node_id) : graph.addNode(node_id);
			target_node = graph.hasNodeID(target_node_id) ? graph.getNodeById(target_node_id) : graph.addNode(target_node_id);
						
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
				edge = graph.addEdge(edge_id, node, target_node, {directed: directed});
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

export {ICSVInput, CSVInput};