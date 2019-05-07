import {IGraph, BaseGraph} from '../core/Graph';
import { IBaseNode } from '../core/Nodes';
import { IBaseEdge } from '../core/Edges';
import * as $SU from "../utils/structUtils";

import { Logger } from "../utils/logger";
const logger = new Logger();


const DEFAULT_WEIGHTED = false;
const DEFAULT_ALPHA = 0.15;
const DEFAULT_MAX_ITERATIONS = 1e3;
const DEFAULT_CONVERGENCE = 1e-4;
const DEFAULT_NORMALIZE = false;
const defaultInit = (graph: IGraph) => 1 / graph.nrNodes();


/**
 * Return type
 */
export type RankMap = {[id: string] : number};


/**
 * Data structs we need for the array version of pagerank
 * 
 * @description we assume that nodes are always in the same order in the various arrays, 
 *              with the exception of the pull sub-arrays, of course (which give the node index as values)
 * 
 * @todo write a method that takes a graph and produces those array in the same order
 * @todo guarantee that the graph doesn't change during that mapping -> unmapping process 
 *       already guaranteed by the single-threadedness of JS/Node, unless we build workers into it...
 */
interface PRArrayDS {
  curr    : Array<number>;
  old     : Array<number>;
  outDeg  : Array<number>;
  pull    : Array<Array<number>>;
}


/**
 * Configuration object for PageRank class
 */
export interface PrRandomWalkConfig {
  weighted?     : boolean;
  alpha?        : number;
  convergence?  : number;
  iterations?   : number;
  normalize?    : boolean;
  init?         : Function;
  PRArrays?     : PRArrayDS;
}


/**
 * PageRank for all nodes of a given graph by performing Random Walks
 * Implemented to give the same results as the NetworkX implementation, just faster!
 * 
 * @description We assume that all necessary properties of a node's feature vector
 *              has been incorporated into it's initial rank or the link structure
 *              of the graph. This way we can 
 * 
 * @todo find a paper / article detailing this implementation
 * @todo compute a ground truth for our sample social networks (python!)
 */
export class PageRankRandomWalk {
  /**
   * @todo unused as of now ??
   */
  private _weighted       : boolean;
  private _alpha          : number;
  private _convergence    : number;
  private _maxIterations  : number;
  private _init           : number;
  private _normalize      : boolean;

  /**
   * Holds all the data structures necessary to compute PR in LinAlg form
   */
  private _PRArrayDS      : PRArrayDS;

  constructor( private _graph: IGraph, config?: PrRandomWalkConfig ) {
    config = config || {}; // just so we don't get `property of undefined` errors below
    this._weighted = config.weighted || DEFAULT_WEIGHTED;
    this._alpha = config.alpha || DEFAULT_ALPHA;
    this._maxIterations = config.iterations || DEFAULT_MAX_ITERATIONS;
    this._convergence = config.convergence || DEFAULT_CONVERGENCE;
    this._normalize = config.normalize || DEFAULT_NORMALIZE;
    this._init = config.init ? config.init(this._graph) : defaultInit(this._graph);

    this._PRArrayDS = config.PRArrays || {
      curr    : [],
      old     : [],
      outDeg  : [],
      pull    : []
    }

    /**
     * Just for the purpose of testing
     * 
     * @todo but then the _graph constructor argument is useless - how to handle this??
     */
    config.PRArrays || this.constructPRArrayDataStructs();
  }


  getConfig() {
    return {
      _weighted: this._weighted,
      _alpha: this._alpha,
      _maxIterations: this._maxIterations,
      _convergence: this._convergence,
      _normalize: this._normalize,
      _init: this._init
    }
  }


  getDSs() {

  }


  constructPRArrayDataStructs() {
    let tic = +new Date;

    let nodes = this._graph.getNodes();    
    let i = 0;
    for( let key in nodes ) {
      let node = this._graph.getNodeById(key);

      // set identifier to re-map later..
      node.setFeature('PR_index', i);

      this._PRArrayDS.curr[i] = this._init;
      this._PRArrayDS.old[i] = this._init;
      this._PRArrayDS.outDeg[i] = node.outDegree() + node.degree();
      ++i;
    }

    /**
     * We can only do this once all the mappings [node_id => arr_idx] have been established!
     */
    for( let key in nodes ) {
      let node = this._graph.getNodeById(key);
      let node_idx = node.getFeature('PR_index');

      // set nodes to pull from
      let pull_i = [];
      let incoming_edges = $SU.mergeObjects([node.inEdges(), node.undEdges()]);      
      for( let edge_key in incoming_edges ) {
        let edge: IBaseEdge = incoming_edges[edge_key];
        let source: IBaseNode = edge.getNodes().a;
        if(edge.getNodes().a.getID() == node.getID()) {
          source = edge.getNodes().b;
        }
        let parent_idx = source.getFeature('PR_index');
        pull_i.push(parent_idx);
      }
      this._PRArrayDS.pull[node_idx] = pull_i;
    }

    let toc = +new Date;
    logger.log(`PR Array DS init took ${toc-tic} ms.`);
  }


  private getRankMapFromArray() {
    let result : RankMap = {};
    let nodes = this._graph.getNodes();
    if ( this._normalize ) {
      this.normalizePR();
    }
    for( let key in nodes ) {
      let node_val = this._PRArrayDS.curr[nodes[key].getFeature('PR_index')];
      result[key] = node_val;
    }
    return result;
  }


  private normalizePR() {
    let pr_sum = this._PRArrayDS.curr.reduce((i, j) => i + j, 0);
    if (pr_sum !== 1) {
      this._PRArrayDS.curr = this._PRArrayDS.curr.map(n => n / pr_sum);
    }
  }


  computePR() {
    const ds = this._PRArrayDS;
    // logger.log( JSON.stringify(ds) );

    const N = this._graph.nrNodes();

    // debug
    let visits = 0;

    for(let i = 0; i < this._maxIterations; ++i) {
      let delta_iter = 0.0;

      // node is number... !
      for ( let node in ds.curr ) {

        let pull_rank = 0;
        visits++;

        for ( let source of ds.pull[node] ) {
          visits++;
          /**
           * This should never happen....
           * IF the data structure _PRArrayDS was properly constructed
           * 
           * @todo properly test _PRArrayDS as well as this beauty 
           *       (using a contrived, wrongly constructed pull 2D array)
           */
          if ( ds.outDeg[source] === 0 ) {
            logger.log( `Node: ${node}` );
            logger.log( `Source: ${source} `);
            throw('Encountered zero divisor!');
          }
          pull_rank += ds.old[source] / ds.outDeg[source];
        }
        
        /**
         * are we already dealing with dangling nodes implicitly !?!?
         */
        ds.curr[node] = (1-this._alpha)*pull_rank + this._alpha / N;
        delta_iter += Math.abs(ds.curr[node] - ds.old[node]);
      }

      if ( delta_iter <= this._convergence ) {
        logger.log(`CONVERGED after ${i} iterations with ${visits} visits and a final delta of ${delta_iter}.`);
        return this.getRankMapFromArray();
      }

      ds.old = [...ds.curr];
    }

    logger.log(`ABORTED after ${this._maxIterations} iterations with ${visits} visits.`);
    return this.getRankMapFromArray();
  }

}
