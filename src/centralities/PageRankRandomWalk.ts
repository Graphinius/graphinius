import * as $G from '../core/Graph';
import * as $SU from "../utils/structUtils";
import { Logger } from "../utils/logger";
const logger = new Logger();

/**
 * For now, we just use a node_id -> rank mapping
 */
export type RankMap = {[id: string] : number};

/**
 * Configuration object for PageRank class
 */
export interface PrRandomWalkConfig {
  weighted?: boolean;
  alpha?: number;
  convergence?: number;
  iterations?: number;
}

const DEFAULT_WEIGHTED = false;
const DEFAULT_ALPHA = 1e-1;
const DEFAULT_ITERATIONS = 1e3;
const DEFAULT_CONVERGENCE = 1.25e-4;

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
  private _weighted: boolean;
  private _alpha: number;
  private _convergence: number;
  private _iterations: number;

  constructor( private _graph: $G.IGraph, config?: PrRandomWalkConfig ) {
    config = config || {}; // just so we don't get `property of undefined` errors below
    this._weighted = config.weighted || DEFAULT_WEIGHTED;
    this._alpha = config.alpha || DEFAULT_ALPHA;
    this._iterations = config.iterations || DEFAULT_ITERATIONS;
    this._convergence = config.convergence || DEFAULT_CONVERGENCE;
  }

  
  getCentralityMap(): RankMap {
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
    }    

    /**
     * Initialize starting values (1/n for each node)
     * 
     * @todo replace with array versions
     */
    for( let key in nodes ) {
      curr[key] = 1/nrNodes;
      old[key] = 1/nrNodes;
    }

    /**
     * MAIN
     */
    for(let i = 0; i < this._iterations; i++) {
      let me = 0.0;

      for( let key in nodes ) {
        let total = 0;

        /**
         * @todo what about dangling nodes ?
         */
        let parents = structure[key]['inc'];
        for(let k in parents) {
          let p = String(parents[k]);
          total += old[p]/structure[p]['deg'];
        }

        // logger.log("o:"+old[key] + " n:"+curr[key]);

        curr[key] = total*(1-this._alpha) + this._alpha/nrNodes;
        me += Math.abs(curr[key]-old[key]);
      }

      /**
       * @description return once the total change <= convergence threshold
       */
      if(me <= this._convergence){
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
    return curr;
  }

}
