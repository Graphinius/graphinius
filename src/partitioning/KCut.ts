import { IGraph } from '../core/Graph';
import { IBaseNode } from '../core/Nodes';
import { IBaseEdge } from '../core/Edges';
import * as $SU from '../utils/structUtils';
import { Logger } from '../utils/logger';
const logger = new Logger();


export interface GraphPartitioning {
  partitions: {[key:string]: Partition};
  nodePartMap: {[key:string]: string};
  nodeFrontMap: {[key:string]: boolean};
  // intraEdges: {[key:string]: IBaseEdge};
  // interEdges: {[key:string]: IBaseEdge};
  cut_cost: number;
}


export interface Partition {
  nodes: {[key:string]: IBaseNode};
}


export default class KCut {

  private _partitioning : GraphPartitioning;

  constructor(private _graph : IGraph) {
    this._partitioning = {
      partitions: {},
      nodePartMap: {},
      nodeFrontMap: {},
      cut_cost: 0
    };
  }


  cut(k: number, shuffle: boolean = false) : GraphPartitioning {
    const nodes = this._graph.getNodes(),
          n = Object.keys(nodes).length,
          nr_parts = k;
    
    let nr_rest = n%k;
    let node_ids = Object.keys(this._graph.getNodes());
    shuffle && $SU.shuffleArray( node_ids );

    let node_idx = 0;

    for ( let i = 0; i < nr_parts; i++ ) {
      let part_size = Math.floor(n/k);
      let partition : Partition = {
        nodes: {}
      }
      // Adding nodes, either in order or shuffled
      while( part_size-- ) {
        let node = this._graph.getNodeById(node_ids[node_idx++]);
        partition.nodes[node.getID()] = node;
      }
      // Distributing 'rest' nodes to earliest 'rest' partitions
      if( nr_rest ) {
        let node = this._graph.getNodeById(node_ids[node_idx++]);
        partition.nodes[node.getID()] = node;
        nr_rest--;
      }
      this._partitioning.partitions[i] = partition;
    }

    return this._partitioning;
  }

}