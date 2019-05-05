import {IGraph, BaseGraph} from '../core/Graph';
import * as $SU from "../utils/structUtils";
import { Logger } from "../utils/logger";
import { pathToFileURL } from 'url';
import { IBaseNode } from '../core/Nodes';
const logger = new Logger();

/**
 * For now, we just use a node_id -> rank mapping
 */
export type RankMap = {[id: string] : number};

/**
 * Configuration object for PageRank class
 */
export interface PrRandomWalkConfig {
  weighted?     : boolean;
  alpha?        : number;
  convergence?  : number;
  iterations?   : number;
  init?         : Function;
}


/**
 * Data structs we need for the array version of pagerank
 * 
 * @description we assume that nodes are always in the same order in the various arrays
 * @description for now, we don't care about mapping the values back to node objects...
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

const DEFAULT_WEIGHTED = false;
const DEFAULT_ALPHA = 1e-1;
const DEFAULT_MAX_ITERATIONS = 1e3;
const DEFAULT_CONVERGENCE = 1e-6;
const defaultInit = (graph: IGraph) => 1 / graph.nrNodes();

/**
 * Returns the PageRank for all nodes of a given graph by performing Random Walks
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

  private _PRArrayDS      : PRArrayDS;

  constructor( private _graph: IGraph, config?: PrRandomWalkConfig ) {
    config = config || {}; // just so we don't get `property of undefined` errors below
    this._weighted = config.weighted || DEFAULT_WEIGHTED;
    this._alpha = config.alpha || DEFAULT_ALPHA;
    this._maxIterations = config.iterations || DEFAULT_MAX_ITERATIONS;
    this._convergence = config.convergence || DEFAULT_CONVERGENCE;
    this._init = config.init ? config.init(this._graph) : defaultInit(this._graph);

    this._PRArrayDS = {
      curr    : [],
      old     : [],
      outDeg  : [],
      pull    : []
    }
    this.setPRArrayDataStructs();
  }


  setPRArrayDataStructs() {
    let tic = +new Date;

    let nodes = this._graph.getNodes();
        // keys = Object.keys(nodes);
    
    let i = 0;
    for( let key in nodes ) {
      let node = this._graph.getNodeById(key);
      // set identifier to re-map later..
      node.setFeature('PR_index', i);

      this._PRArrayDS.curr[i] = this._init;
      this._PRArrayDS.curr[i] = this._init;
      this._PRArrayDS.outDeg[i] = node.outDegree()+node.degree();
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
      let incomingEdges = $SU.mergeObjects([node.inEdges(), node.undEdges()]);      
      for( let edge in incomingEdges ) {
        let edgeNode = incomingEdges[edge];
        let parent: IBaseNode = edgeNode.getNodes().a;
        if(edgeNode.getNodes().a.getID() == node.getID()) {
          parent = edgeNode.getNodes().b;
        }
        let parent_idx = parent.getFeature('PR_index');
        pull_i.push(parent_idx);
      }
      this._PRArrayDS.pull[node_idx] = pull_i;
    }

    // console.log(this._PRArrayDS.pull);

    let toc = +new Date;
    logger.log(`PR Array DS init took ${toc-tic} ms.`)
  }


  getPRArray() {
    let result : RankMap = {};
    let nodes = this._graph.getNodes();

    let ds = this._PRArrayDS;
    for(let i = 0; i < this._maxIterations; ++i) {
      let delta_iter = 0.0;

      // node is number... !
      for ( let node in ds.curr ) {
        let total_pull = 0;
        for ( let source in ds.pull[node] ) {
          total_pull += ds.old[source] / ds.outDeg[source];
        }
        ds.curr[node] = (1-this._alpha) * total_pull + this._alpha/ds.curr.length;
        delta_iter += ds.curr[node] - ds.old[node];
      }

      if ( delta_iter <= this._convergence ) {
        logger.log(`Converged after ${i} iterations.`);
        return;
      }
    }

    for( let key in nodes ) {
      result[key] = ds.curr[nodes[key].getFeature('PR_index')];
    }
    console.log(result);
    logger.log(`Converged after ${this._maxIterations} iterations.`);
    return result;
  }

  
  getPRDict(): RankMap {
    let curr : RankMap = {};
    let old : RankMap = {};
    let nodes = this._graph.getNodes();
    let nrNodes = this._graph.nrNodes();
    
    /**
     * @description the whole datastructure to operate on
     * 
     * @todo replace with faster array versions of substructure that can be
     *       vectorized into TFjs
     */
    let structure = {};

    /**
     * @description
     */
    for( let key in nodes ) {
      let node = this._graph.getNodeById(key);
      structure[key] = {};

      /**
       * Weight that each node can push per iteration
       */
      structure[key]['deg'] = node.outDegree()+node.degree();

      /**
       * Set all incoming edges for each node
       * 
       * @description treats undirected edges as incoming edges as well
       * @todo decide on whether PR should only be defined on directed (sub-)graphs
       * @todo decide on whether to implicitly transform an undirected (sub-)graph
       *       into a directed one, as NetworkX does it...
       */
      structure[key]['inc'] = [];
      let incomingEdges = $SU.mergeObjects([node.inEdges(), node.undEdges()]);      
      for( let edge in incomingEdges ) {
        let edgeNode = incomingEdges[edge];
        let parent = edgeNode.getNodes().a;
        if(edgeNode.getNodes().a.getID() == node.getID())
          parent = edgeNode.getNodes().b;
        structure[key]['inc'].push(parent.getID());
      }

      /**
       * Initialize starting values (1/n for each node)
       * 
       * @todo replace with array versions
       */
      curr[key] = this._init;
      old[key]  = this._init;
    }    

    /**
     * MAIN
     */
    // debug
    let visits = 0;

    for(let i = 0; i < this._maxIterations; i++) {
      let delta_iter = 0.0;

      for( let key in nodes ) {
        let total = 0;
        visits++;

        /**
         * @todo what about dangling nodes ?
         */
        let parents = structure[key]['inc'];
        for(let k in parents) {
          visits++;
          let p = String(parents[k]);
          total += old[p]/structure[p]['deg'];
        }

        // logger.log("o:"+old[key] + " n:"+curr[key]);

        curr[key] = total*(1-this._alpha) + this._alpha/nrNodes;
        delta_iter += Math.abs(curr[key]-old[key]);
      }

      /**
       * @description return once the total change <= convergence threshold
       */
      if(delta_iter <= this._convergence) {
        logger.log(`Converged after ${i} iterations with ${visits} visits.`);
        return curr;
      }
      
      /**
       * OUCH....
       *
       * @todo just swap array(s | pointers) !!
       * @todo figure out how to do that in TFjs
       */
      old = $SU.clone(curr);
    }

    logger.log(`Converged after ${this._maxIterations} iterations with ${visits} visits.`);
    return curr;
  }

}
