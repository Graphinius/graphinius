import { IGraph } from '../core/Graph';
import * as $SU from '../utils/structUtils';
import { GraphPartitioning, Partition } from './Interfaces';
import { Logger } from '../utils/logger';
import { IBaseNode } from '../core/Nodes';
const logger = new Logger();

const DEFAULT_WEIGHT = 1;

interface SubGain {
  target: IBaseNode;
  gain: number;
}

type Gains = {[source: string]: SubGain};

interface KL_Costs {
  internal: {[key:string]: number};
  external: {[key:string]: number};
  // gain: Gains;
  maxGain: {source: IBaseNode, target: IBaseNode, gain: number};
}


export class KLPartitioning {

  public _partitioning : GraphPartitioning;
  public _costs : KL_Costs;
  public _fixed : {[key: string]: IBaseNode};

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
      // gain: {},
      maxGain: {source: null, target: null, gain: 0}
    };
    this._fixed = {};

    this.initPartitioning(initShuffle);

    if ( Object.keys(this._partitioning.partitions).length > 2) {
      throw new Error("KL partitioning works on 2 initial partitions only.")
    }

    this.initCosts();
  }


  private initPartitioning(initShuffle) {
    for (let key of Object.keys(this._graph.getNodes())) {
      let node = this._graph.getNodeById(key);
      
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
    }
  }


  private initCosts() {
    let adj_list = this._graph.adjListDict();

    for (let key of Object.keys(this._graph.getNodes())) {
      /**
       * Initialize the node costs
       * 
       * @todo shall we introduce "in-partition-edges" & "cross-partition-edges"?
       */

      let nodePartMap = this._partitioning.nodePartMap;

      process.stdout.write(key + ' : ');
      /**
       * @todo introduce weighted mode
       */
      Object.keys(adj_list[key]).forEach( target => {
        process.stdout.write(target);
        process.stdout.write(`[${nodePartMap[key]}, ${nodePartMap[target]}]`);

        if ( nodePartMap[key] === nodePartMap[target] ) {
          process.stdout.write('\u2713' + ' ');
          if ( this._costs.internal[key] ) {
            this._costs.internal[key] += DEFAULT_WEIGHT;
          } else {
            this._costs.internal[key] = DEFAULT_WEIGHT;
          }
        } else {
          process.stdout.write('\u2717' + ' ');
          if ( this._costs.external[key] ) {
            this._costs.external[key] += DEFAULT_WEIGHT;
          } else {
            this._costs.external[key] = DEFAULT_WEIGHT;
          }
        }
      });
      console.log('');
    }
  }


  calculateIterationGains() {

  }


  doIterationSwap() {
    
  }
}
