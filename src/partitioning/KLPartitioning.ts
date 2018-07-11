import { IGraph } from '../core/Graph';
import { IBaseNode } from '../core/Nodes';
import { GraphPartitioning, Partition } from './Interfaces';
import { KCut } from './KCut';
import { BinaryHeap, BinaryHeapMode } from '../datastructs/binaryHeap';

import { Logger } from '../utils/logger';
const logger = new Logger();

const DEFAULT_WEIGHT = 1;

export type GainEntry = {
  id: string, 
  source: IBaseNode, 
  target: IBaseNode,
  gain: number
};


export interface KL_Costs {
  internal: {[key:string]: number};
  external: {[key:string]: number};
}


export interface KL_Config {
  initShuffle? : boolean;
  directed?    : boolean;
  weighted?    : boolean;
}


export interface KL_Open_Sets {
  partition_a : Map<string, boolean>;
  partition_b : Map<string, boolean>;
}

/**
 * We require node features to have partition entries 1 & 2, EXACTLY!
 * 
 * @todo make it less brittle? Is this brittle at all? Or a sound assumption?
 */
export class KLPartitioning {

  public _partitionings       : Map<number, GraphPartitioning>;
  public _costs               : KL_Costs;
  public _gainsHeap           : BinaryHeap;
  
  public _bestPartitioning    : number;
  public _currentPartitioning : number;
  public _open_sets           : KL_Open_Sets;

  public _adjList : {};
  // for faster iteration, as long as we're not using Maps
  private _keys : Array<string>;
  private _config : KL_Config;
  private _gainsHash : Map<string, GainEntry>; // {[key: string]: GainEntry};

  constructor(private _graph : IGraph, config? : KL_Config) {
    this._config = config || {
      initShuffle: false,
      directed: false,
      weighted: false
    }
    this._bestPartitioning = 1;
    this._currentPartitioning = 1;
    this._partitionings = new Map<number, GraphPartitioning>();
    this._gainsHash = new Map<string, GainEntry>();
    
    this._costs = {
      internal: {},
      external: {},
    };

    this._open_sets = {
      partition_a : new Map<string, boolean>(),
      partition_b : new Map<string, boolean>()
    };

    this._adjList = this._graph.adjListDict();
    this._keys = Object.keys(this._graph.getNodes());

    this.initPartitioning(this._config.initShuffle);

    let nr_parts = this._partitionings.get(this._currentPartitioning).partitions.size;
    if ( nr_parts !== 2 ) {
      throw new Error(`KL partitioning works on 2 initial partitions only, got ${nr_parts}.`);
    }

    this.initCosts();
    this.initGainsHeap();
  }


  private initPartitioning(initShuffle) {
    // logger.log(`Init Shuffle: ${initShuffle}`);

    if ( initShuffle ) {
      this._partitionings.set(this._currentPartitioning, new KCut(this._graph).cut(2, true));
      let part_it = this._partitionings.get(this._currentPartitioning).partitions.values();
      // Redundant?
      part_it.next().value.nodes.forEach( node => {
        this._open_sets.partition_a.set(node.getID(), true);
      });
      part_it.next().value.nodes.forEach( node => {
        this._open_sets.partition_b.set(node.getID(), true);
      });
    } else {
      let partitioning = {
        partitions: new Map<number, Partition>(),
        nodePartMap: new Map<string, number>(),
        cut_cost: 0
      };
      this._partitionings.set(this._currentPartitioning, partitioning);
      
      for (let key of this._keys) {
        let node = this._graph.getNodeById(key);
        
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

        // fill open sets
        if (node_part === 1) {
          this._open_sets.partition_a.set(key, true);
        }
        else {
          this._open_sets.partition_b.set(key, true);
        }
      }
    }
  }


  private initCosts() {
    let partitioning = this._partitionings.get(this._currentPartitioning),
        nodePartMap = partitioning.nodePartMap;

    for (let source of Object.keys(this._graph.getNodes())) {
      // logger.write(source + ' : ');

      // Initialize internal & external cost arrays
      this._costs.external[source] = 0;
      this._costs.internal[source] = 0;

      /**
       * @todo introduce weighted mode
       */
      Object.keys(this._adjList[source]).forEach( target => {
        // logger.write(`[${nodePartMap.get(source)}, ${nodePartMap.get(target)}]`);

        /**
         * @todo check for valid number, parse?
         */
        let edge_weight = this._config.weighted ? this._adjList[source][target] : DEFAULT_WEIGHT;

        if ( nodePartMap.get(source) === nodePartMap.get(target) ) {
          // logger.write('\u2713' + ' ');
          this._costs.internal[source] += edge_weight;
        } else {
          // logger.write('\u2717' + ' ');
          this._costs.external[source] += edge_weight;
          partitioning.cut_cost += edge_weight;
        }
      });
      // logger.log('');
    }

    // we counted every edge twice in the nested loop above...
    partitioning.cut_cost /= 2;
  }


  initGainsHeap() {
    let partitioning = this._partitionings.get(this._currentPartitioning),
        partition_iterator = partitioning.partitions.values(),
        first_partition = partition_iterator.next().value,
        second_partition = partition_iterator.next().value;
    
    let evalID = (obj: GainEntry) => obj.id,
        evalPriority = (obj: GainEntry) => obj.gain;
    this._gainsHeap = new BinaryHeap( BinaryHeapMode.MAX, evalPriority, evalID );
    
    /**
     * We only calculate for node pairs in different partitions
     */        
    first_partition.nodes.forEach( source => {
      let source_id = source.getID();
      // logger.write(source_id + ': ');
      
      second_partition.nodes.forEach( target => {
        let target_id = target.getID();
        // logger.write(target_id + ', ');

        let edge_weight = 0;
        let adj_weight = parseFloat(this._adjList[source_id][target_id]);
        if ( !isNaN(adj_weight) ) {
          edge_weight = this._config.weighted ? adj_weight : DEFAULT_WEIGHT;
        }
        let pair_gain = this._costs.external[source_id] - this._costs.internal[source_id] + this._costs.external[target_id] - this._costs.internal[target_id] - 2*edge_weight;
        
        // logger.log(`Pair gain for (${source_id}, ${target_id}): ${pair_gain}`);

        let gain_entry : GainEntry = {
          id: `${source_id}_${target_id}`,
          source: source,
          target: target,
          gain: pair_gain
        }
        this._gainsHeap.insert(gain_entry);
        this._gainsHash.set(gain_entry.id, gain_entry);
      });
      // logger.log('');
    });
  }


  performIteration() {
    let ge = this.doSwapAndDropLockedConnections();
    this.updateCosts( ge );
    // make a new partitioning for the next cycle / iteration
    this._currentPartitioning++;
  }


  updateCosts(swap_ge: GainEntry) : void {
    this._gainsHash.forEach( (k, v) => {
      logger.log(k.id);
    });

    let partitioning = this._partitionings.get(this._currentPartitioning);
    partitioning.cut_cost -= swap_ge.gain;
    let partition_iterator = partitioning.partitions.keys(),
        first_partition = partition_iterator.next().value,
        second_partition = partition_iterator.next().value;


    [swap_ge.source, swap_ge.target].forEach( source => {
      let influencer = source.getID();
      source.allNeighbors().forEach( ne => {
        let source_id = ne.node.getID();        
        logger.log(`Cost update for node ${source_id}`);

        /** 
         * We need to update all gains that involve nodes hitherto
         * connected to the swapped nodes, which means all entries
         * on the heap array those nodes are part of!
         * 
         * @comment We cannot use the adjList however, since we need
         * to update ALL possible future swaps, not only their connections...
         * 
         * @todo Find a way to look up those pairs efficiently
         */

        // how to build source_target string (always part1_part2)...
        let gain_id;
        if ( partitioning.nodePartMap.get(influencer) === first_partition ) {
          gain_id = `${influencer}_${source_id}`;
        }
        else {
          gain_id = `${source_id}_${influencer}`;
        }

        
        

        // logger.log(`Pair gain for (${gain_id}): ${gain_entry.gain}`);

        // this._gainsHeap.insert( gain_entry );      
      });

    });

  }


  doSwapAndDropLockedConnections() : GainEntry{
    let gain_entry : GainEntry = this._gainsHeap.pop(),
        source_id = gain_entry.id.split('_')[0],
        target_id = gain_entry.id.split('_')[1];

    // remove gain_entry from hash map
    this._gainsHash.delete(gain_entry.id);

    let partitioning = this._partitionings.get(this._currentPartitioning),
        partition_iterator = partitioning.partitions.values(),
        first_partition = partition_iterator.next().value.nodes,
        second_partition = partition_iterator.next().value.nodes;

    // Swap partitions
    logger.log(`Swapping node pair (${source_id}, ${target_id})`);

    first_partition.delete(source_id);
    first_partition.set(target_id, gain_entry.target);
    second_partition.delete(target_id);
    second_partition.set(source_id, gain_entry.source);

    /**
     * Go over all possible gains involving the
     * swapped nodes & remove from heap
     * 
     * Non-existing (duplicate) gain entries don't matter,
     * since the heap will simply find nothing / return undefined
     *  
     * @comment: Gain_Entry id's are always structured in the form
     * `${1st_partition_node}_${2nd_partition_node}` , so => 
     * @comment Connections from source_id can only go to second partition
     * @comment Connections to target_id can only come from first partition
     * @comment Always runs in O(n) with initial n...
     */
    second_partition.forEach( target => {
      let target_id = target.getID();
      // logger.log(`${source_id}_${target_id}`);
      this.removeGainsEntry(`${source_id}_${target_id}`);
    });
 
    first_partition.forEach( source => {
      let source_id = source.getID();
      // logger.log(`${source_id}_${target_id}`);
      this.removeGainsEntry(`${source_id}_${target_id}`);      
    });
    
    return gain_entry;
  }


  private removeGainsEntry(heap_id: string) : void {
    if ( this._gainsHash.has(heap_id) ) {
      this._gainsHeap.remove(this._gainsHash.get(heap_id));
      this._gainsHash.delete(heap_id);
    }
  }

}
