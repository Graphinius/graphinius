import { IGraph } from '../core/Graph';
import * as $SU from '../utils/structUtils';
import { GraphPartitioning, Partition } from './Interfaces';
import { Logger } from '../utils/logger';
import { IBaseNode } from '../core/Nodes';
const logger = new Logger();


interface SubGain {
  target: IBaseNode;
  gain: number;
}

type Gains = {[source: string]: SubGain};

interface KL_Costs {
  internal: {[key:string]: number};
  external: {[key:string]: number};
  gain: Gains;
  maxGain: {source: IBaseNode, target: IBaseNode, gain: number};
}


export class KLPartitioning {

  public _partitioning : GraphPartitioning;
  public _costs : KL_Costs;

  constructor(private _graph : IGraph, initShuffle: boolean = false) {
    this._partitioning = {
      partitions: {},
      nodePartMap: {},
      nodeFrontMap: {},
      cut_cost: 0
    };
    this._costs = {
      internal: {},
      external: {},
      gain: {},
      maxGain: {source: null, target: null, gain: 0}
    };

    for (let key of Object.keys(this._graph.getNodes())) {
      let node = this._graph.getNodeById(key);
      
      // Initialize the partitioning
      if ( !initShuffle ) {
        // assume we have a node feature 'partition'
        let node_part = node.getFeature('partition');
        if ( node_part == null ) {
          throw new Error('no node feature "partition" encountered - you need to set initShuffle to true');
        } else {
          this._partitioning.nodePartMap[key] = node_part;
          if ( !this._partitioning.partitions[node_part] ) {
            this._partitioning.partitions[node_part] = {
              nodes: {}
            }
          }
          this._partitioning.partitions[node_part].nodes[key] = node;
        }
      }

      if ( Object.keys(this._partitioning.partitions).length > 2) {
        throw new Error("KL partitioning works on 2 initial partitions only.")
      }

      /**
       * Initialize the node costs
       * 
       * @todo shall we introduce "in-partition-edges" & "cross-partition-edges"?
       */
      
            
      


    }
  }


}