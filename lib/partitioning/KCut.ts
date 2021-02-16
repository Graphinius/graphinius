import { IBaseNode } from '@/core/base/BaseNode';
import { IGraph } from '@/core/base/BaseGraph';
import * as $SU from '@/utils/StructUtils';
import { GraphPartitioning, Partition } from './interfaces';


export class KCut {

  private _partitioning : GraphPartitioning;

  constructor(private _graph : IGraph) {
    this._partitioning = {
      partitions: new Map<number, Partition>(),
      nodePartMap: new Map<string, number>(),
      cut_cost: 0
    };
  }


  cut(k: number, shuffle: boolean = false) : GraphPartitioning {
    const nodes = this._graph.getNodes(),
          keys = Object.keys(nodes),
          n = keys.length,
          nr_parts = k;
    
    let nr_rest = n%k;
    let node_ids = Object.keys(this._graph.getNodes());
    shuffle && $SU.shuffleArray( node_ids );

    let node_idx = 0;
    let nodePartMap = new Map<string, number>();

    // In maths, partition numbers start with "1"
    for ( let i = 1; i <= nr_parts; i++ ) {
      let part_size = Math.floor(n/k);
      let partition : Partition = {
        nodes: new Map<string, IBaseNode>()
      }

      // Adding nodes, either in order or shuffled
      while ( part_size-- ) {
        let node = this._graph.getNodeById(node_ids[node_idx++]);
        partition.nodes.set(node.getID(), node);
        nodePartMap.set(node.getID(), i);
      }
      // Distributing 'rest' nodes to earliest 'rest' partitions
      if ( nr_rest ) {
        let node = this._graph.getNodeById(node_ids[node_idx++]);
        partition.nodes.set(node.getID(), node);
        nodePartMap.set(node.getID(), i);
        nr_rest--;
      }
      this._partitioning.partitions.set(i, partition);
    }

    this._partitioning.nodePartMap = nodePartMap;

    return this._partitioning;
  }

}