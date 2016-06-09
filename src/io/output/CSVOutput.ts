/// <reference path="../../../typings/tsd.d.ts" />

import path = require('path');
import fs = require('fs');
import http = require('http');

import * as $N from '../../core/Nodes';
import * as $E from '../../core/Edges';
import * as $G from '../../core/Graph';
import * as $R from '../../utils/remoteUtils';


export interface ICSVOutput {
	_separator					: string;
	_explicit_direction	: boolean;
	_direction_mode			: boolean; // true => directed

	writeToAdjacencyListFile(filepath : string, graph : $G.IGraph) : void;
	writeToAdjacencyList(graph : $G.IGraph) : string;

	writeToEdgeListFile(filepath : string, graph : $G.IGraph) : void;
	writeToEdgeList(graph : $G.IGraph) : string;
}

class CSVOutput implements ICSVOutput {
	
	constructor(public _separator: string = ',',
							public _explicit_direction: boolean = true,
							public _direction_mode: boolean = false) {
	}
  
  writeToAdjacencyListFile(filepath : string, graph : $G.IGraph) : void {
    if ( typeof window !== 'undefined' && window !== null ) {
      throw new Error('cannot write to File inside of Browser');
    }
    
    fs.writeFileSync(filepath, this.writeToAdjacencyList(graph));
  }
  
	writeToAdjacencyList(graph : $G.IGraph) : string {
    var graphString = "";
    var nodes = graph.getNodes(),
        node : $N.IBaseNode = null,
        adj_nodes : Array<$N.NeighborEntry> = null,
        adj_node : $N.IBaseNode = null;
        
    var mergeFunc = (ne: $N.NeighborEntry) => {
      return ne.node.getID();
    };
        
    // TODO make generic for graph mode
    for ( var node_key in nodes ) {
      node = nodes[node_key];      
      graphString += node.getID();      
      adj_nodes = node.reachNodes(mergeFunc);
      
      for ( var adj_idx in adj_nodes ) {
        adj_node = adj_nodes[adj_idx].node;
        graphString += this._separator + adj_node.getID();
      }
      graphString += "\n";
    }
    
    return graphString;    
  }
  
	writeToEdgeListFile(filepath : string, graph : $G.IGraph) : void {
    throw new Error("CSVOutput.writeToEdgeListFile not implemented yet.");
    
  }
  
	writeToEdgeList(graph : $G.IGraph) : string {
    throw new Error("CSVOutput.writeToEdgeList not implemented yet.");
    // var graphString = "";
    
    // return graphString;
  }
  
}

export { CSVOutput };