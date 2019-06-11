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

	writeToEdgeListFile(filepath : string, graph : $G.IGraph, weighted: boolean) : void;
	writeToEdgeList(graph : $G.IGraph, weighted: boolean) : string;
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
    let graphString = "";
    let nodes = graph.getNodes(),
        node : $N.IBaseNode = null,
        adj_nodes : Array<$N.NeighborEntry> = null,
        adj_node : $N.IBaseNode = null;
        
    // TODO make generic for graph mode
    for ( let node_key in nodes ) {
      node = nodes[node_key];      
      graphString += node.getID();      
      adj_nodes = node.reachNodes(this.mergeFunc);
      
      for ( let adj_idx in adj_nodes ) {
        adj_node = adj_nodes[adj_idx].node;
        graphString += this._separator + adj_node.getID();
      }
      graphString += "\n";
    }
    
    return graphString;    
  }
  

	writeToEdgeListFile(filepath : string, graph : $G.IGraph, weighted : boolean = false) : void {
    if ( typeof window !== 'undefined' && window !== null ) {
      throw new Error('cannot write to File inside of Browser');
    }
    
    fs.writeFileSync(filepath, this.writeToEdgeList(graph, weighted));
  }
  

  /**
   * Directed before undirected
   * 
   * @param graph
   * @param weighted 
   */
	writeToEdgeList(graph : $G.IGraph, weighted : boolean = false) : string {
    
    let graphString = "",
        nodes = graph.getNodes(),
        node : $N.IBaseNode = null,
        adj_nodes : Array<$N.NeighborEntry> = null,
        adj_entry : $N.NeighborEntry,
        adj_node : $N.IBaseNode = null,
        weight_str: string;

    for ( let node_key in nodes ) {
      node = nodes[node_key];
      adj_nodes = node.reachNodes(this.mergeFunc);
      
      for ( let adj_idx in adj_nodes ) {
        adj_entry = adj_nodes[adj_idx];
        adj_node = adj_entry.node;
        weight_str = '';
        if ( weighted ) {
          weight_str = this._separator;
          weight_str += adj_entry.edge.isWeighted() ? adj_entry.edge.getWeight() : 1;
        }
        graphString += node.getID() + this._separator + adj_node.getID() + weight_str + '\n';
      }
    }
    return graphString;
  }


  private mergeFunc(ne: $N.NeighborEntry) {
    return ne.node.getID();
  }
  
}


export { CSVOutput };