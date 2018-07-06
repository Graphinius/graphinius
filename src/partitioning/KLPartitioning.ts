import { IGraph } from '../core/Graph';
import * as $SU from '../utils/structUtils';
import { GraphPartitioning, Partition } from './Interfaces';
import { IBaseNode } from '../core/Nodes';
import { BinaryHeap, BinaryHeapMode } from '../datastructs/binaryHeap';

import { Logger } from '../utils/logger';
const logger = new Logger();

// we get this through the adj_list...
// const DEFAULT_WEIGHT = 1;


export type Gain = {id: string, source: IBaseNode, target: IBaseNode, gain: number};


interface KL_Costs {
  internal: {[key:string]: number};
  external: {[key:string]: number};
}


export class KLPartitioning {

  public _partitionings : Map<number, GraphPartitioning>;
  public _costs : KL_Costs;
  public _gainsHeap : BinaryHeap;
  
  public _bestPartitioning: number;
  public _currentPartitioning: number;

  public _adjList : {};
  private _keys : Array<string>;
  // public _open: {[key:string]: boolean}

  constructor(private _graph : IGraph, 
              weighted: boolean = false, 
              initShuffle: boolean = false) {
        
    this._bestPartitioning = 1;
    this._currentPartitioning = 1;

    let partitioning = {
      partitions: new Map<number, Partition>(),
      nodePartMap: new Map<string, number>(),
      cut_cost: 0
    };
    this._partitionings = new Map<number, GraphPartitioning>();
    this._partitionings.set(this._currentPartitioning, partitioning);
    
    this._costs = {
      internal: {},
      external: {},
    };

    this._adjList = this._graph.adjListDict();
    this._keys = Object.keys(this._graph.getNodes());

    this.initPartitioning(initShuffle);

    if ( this._partitionings.get(this._currentPartitioning).partitions.size > 2 ) {
      throw new Error("KL partitioning works on 2 initial partitions only.")
    }

    this.initCosts();
    this.initGainsHeap();
  }


  private initPartitioning(initShuffle) {
    let partitioning = this._partitionings.get(this._currentPartitioning);
    for (let key of this._keys) {
      // this._open[key] = true;

      let node = this._graph.getNodeById(key);
      
      if ( !initShuffle ) {
        // assume we have a node feature 'partition'
        let node_part = node.getFeature('partition');
        if ( node_part == null ) {
          throw new Error('no node feature "partition" encountered - you need to set initShuffle to true');
        } else {
          partitioning.nodePartMap.set(key, node_part);
          if ( !partitioning.partitions.get(node_part) ) {
            partitioning.partitions.set(node_part, {
              nodes: new Map<string, IBaseNode>()
            });
          }
          partitioning.partitions.get(node_part).nodes.set(key, node);
        }
      }
      else {
        // we call a random 2-cut
      }
    }
  }


  private initCosts() {
    let partitioning = this._partitionings.get(this._currentPartitioning),
        nodePartMap = partitioning.nodePartMap;

    for (let key of Object.keys(this._graph.getNodes())) {
      logger.write(key + ' : ');
      /**
       * @todo introduce weighted mode
       */
      Object.keys(this._adjList[key]).forEach( target => {
        logger.write(target);
        logger.write(`[${nodePartMap.get(key)}, ${nodePartMap.get(target)}]`);

        let edge_weight = this._adjList[key][target];

        if ( nodePartMap.get(key) === nodePartMap.get(target) ) {
          logger.write('\u2713' + ' ');
          if ( this._costs.internal[key] ) {
            this._costs.internal[key] += edge_weight;
          } else {
            this._costs.internal[key] = edge_weight;
          }
        } else {
          logger.write('\u2717' + ' ');
          if ( this._costs.external[key] ) {
            this._costs.external[key] += edge_weight;
          } else {
            this._costs.external[key] = edge_weight;
          }
          partitioning.cut_cost += edge_weight;
        }
      });
      logger.log('');
    }

    // we counted every edge twice in the nested loop above...
    partitioning.cut_cost /= 2;
  }


  initGainsHeap() {
    let partitioning = this._partitionings.get(this._currentPartitioning);
    let evalID = obj => obj.id;
    let evalPriority = obj => obj.gain;
    this._gainsHeap = new BinaryHeap( BinaryHeapMode.MIN, evalID, evalPriority );
    this._keys.forEach( source => {
      
    });
  }


  updateCosts() {

    // make a new partitioning for the next cycle / iteration
    this._currentPartitioning++;
  }


  doSwapAndDropLockedConnections() {
    
  }
}
