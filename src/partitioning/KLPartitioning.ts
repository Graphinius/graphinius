import { IGraph } from '../core/Graph';
import * as $SU from '../utils/structUtils';
import { GraphPartitioning, Partition } from './Interfaces';
import { IBaseNode } from '../core/Nodes';
import { BinaryHeap, BinaryHeapMode } from '../datastructs/binaryHeap';

import { Logger } from '../utils/logger';
const logger = new Logger();

const DEFAULT_WEIGHT = 1;


export type Gain = {id: string, source: IBaseNode, target: IBaseNode, gain: number};


interface KL_Costs {
  internal: {[key:string]: number};
  external: {[key:string]: number};
}


export class KLPartitioning {

  public _partitioning : GraphPartitioning;
  public _costs : KL_Costs;
  public _gainsHeap : BinaryHeap;

  private _adjList : {};
  private _keys : Array<string>;
  // public _open: {[key:string]: boolean}

  constructor(private _graph : IGraph, initShuffle: boolean = false) {
    this._partitioning = {
      partitions: new Map<number, Partition>(),
      nodePartMap: new Map<string, number>(),
      cut_cost: 0
    };
    this._costs = {
      internal: {},
      external: {},
    };
    this._adjList = this._graph.adjListDict();
    this._keys = Object.keys(this._graph.getNodes());

    this.initPartitioning(initShuffle);

    if ( this._partitioning.partitions.size > 2 ) {
      throw new Error("KL partitioning works on 2 initial partitions only.")
    }

    this.initCosts();
    this.initGainsHeap();
  }


  private initPartitioning(initShuffle) {
    for (let key of this._keys) {
      // this._open[key] = true;

      let node = this._graph.getNodeById(key);
      
      if ( !initShuffle ) {
        // assume we have a node feature 'partition'
        let node_part = node.getFeature('partition');
        if ( node_part == null ) {
          throw new Error('no node feature "partition" encountered - you need to set initShuffle to true');
        } else {
          this._partitioning.nodePartMap.set(key, node_part);
          if ( !this._partitioning.partitions.get(node_part) ) {
            this._partitioning.partitions.set(node_part, {
              nodes: new Map<string, IBaseNode>()
            });
          }
          this._partitioning.partitions.get(node_part).nodes.set(key, node);
        }
      }
    }
  }


  private initCosts() {
    for (let key of Object.keys(this._graph.getNodes())) {
      let nodePartMap = this._partitioning.nodePartMap;

      logger.write(key + ' : ');
      /**
       * @todo introduce weighted mode
       */
      Object.keys(this._adjList[key]).forEach( target => {
        logger.write(target);
        logger.write(`[${nodePartMap.get(key)}, ${nodePartMap.get(target)}]`);

        if ( nodePartMap.get(key) === nodePartMap.get(target) ) {
          logger.write('\u2713' + ' ');
          if ( this._costs.internal[key] ) {
            this._costs.internal[key] += DEFAULT_WEIGHT;
          } else {
            this._costs.internal[key] = DEFAULT_WEIGHT;
          }
        } else {
          logger.write('\u2717' + ' ');
          if ( this._costs.external[key] ) {
            this._costs.external[key] += DEFAULT_WEIGHT;
          } else {
            this._costs.external[key] = DEFAULT_WEIGHT;
          }
          this._partitioning.cut_cost += DEFAULT_WEIGHT;
        }
      });
      logger.log('');
    }

    // we counted every edge twice in the nested loop above...
    this._partitioning.cut_cost /= 2;
  }


  initGainsHeap() {
    let evalID = obj => obj.id;
    let evalPriority = obj => obj.gain;
    this._gainsHeap = new BinaryHeap( BinaryHeapMode.MIN, evalID, evalPriority );
    this._keys.forEach( source => {
      
    });
  }


  updateCosts() {

  }


  doSwapAnd() {
    
  }
}
