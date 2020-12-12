import fs = require('fs');
import * as $N from '../../core/base/BaseNode';
import * as $G from '../../core/base/BaseGraph';


export interface ICSVOutConfig {
	separator?					: string; // default => ','
	explicit_direction?	: boolean; // default => true
	direction_mode?			: boolean; // default => false
	weighted?						: boolean; // true => try to read weights from file, else DEFAULT WEIGHT
}


export interface ICSVOutput {
  _config: ICSVOutConfig;

	writeToAdjacencyListFile(filepath : string, graph : $G.IGraph) : void;
	writeToAdjacencyList(graph : $G.IGraph) : string;

	writeToEdgeListFile(filepath : string, graph : $G.IGraph, weighted: boolean) : void;
	writeToEdgeList(graph : $G.IGraph, weighted: boolean) : string;
}


class CSVOutput implements ICSVOutput {
  _config: ICSVOutConfig;
  
	constructor(config?: ICSVOutConfig) {
    this._config = config || {
			separator: config && config.separator || ',',
			explicit_direction: config && config.explicit_direction || true,
			direction_mode: config && config.direction_mode || false
			// weighted: config && config.weighted || false
		};
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
        graphString += this._config.separator + adj_node.getID();
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
          weight_str = this._config.separator;
          weight_str += adj_entry.edge.isWeighted() ? adj_entry.edge.getWeight() : 1;
        }
        graphString += node.getID() + this._config.separator + adj_node.getID() + weight_str + '\n';
      }
    }
    return graphString;
  }


  private mergeFunc(ne: $N.NeighborEntry) {
    return ne.node.getID();
  }
  
}


export { CSVOutput };
