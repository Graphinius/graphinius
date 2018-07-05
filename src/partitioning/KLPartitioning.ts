import { IGraph } from '../core/Graph';
import * as $SU from '../utils/structUtils';
import { GraphPartitioning, Partition } from './Interfaces';
import { Logger } from '../utils/logger';
const logger = new Logger();


export class KLPartitioning {

  public _partitioning : GraphPartitioning;
  public _internalCosts : {[key:string]: number};
  public _externalCosts : {[key:string]: number};
  // private _diffCosts : {[key:string]: number};

  constructor(private _graph : IGraph, initShuffle: boolean = false) {
    this._partitioning = {
      partitions: {},
      nodePartMap: {},
      nodeFrontMap: {},
      cut_cost: 0
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

      // Initialize the node costs
      

    }
  }


}