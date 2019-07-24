import { IGraph, BaseGraph } from '../core/Graph';
import { IBaseNode } from '../core/Nodes';
import { IBaseEdge } from '../core/Edges';
import { mergeObjects } from "../utils/StructUtils";

import { Logger } from "../utils/Logger";
const logger = new Logger();


const DEFAULT_WEIGHTED = false;
const DEFAULT_ALPHA = 0.15;
const DEFAULT_MAX_ITERATIONS = 1e3;
const DEFAULT_EPSILON = 1e-6;
const DEFAULT_NORMALIZE = false;
const defaultInit = (graph: IGraph) => 1 / graph.nrNodes();


export type InitMap = { [id: string]: number };
export type TeleSet = { [id: string]: number };
export type RankMap = { [id: string]: number };


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
export interface PRArrayDS {
	curr: Array<number>;
	old: Array<number>;
	out_deg: Array<number>;
	pull: Array<Array<number>>;
	pull_weight?: Array<Array<number>>;
	teleport?: Array<number>;
	tele_size?: number;
}


/**
 * Configuration object for PageRank class
 */
export interface PagerankRWConfig {
	weighted?: boolean;
	alpha?: number;
	epsilon?: number;
	iterations?: number;
	normalize?: boolean;
	// init?         : Function;
	PRArrays?: PRArrayDS;
	personalized?: boolean;
	tele_set?: TeleSet;
	init_map?: InitMap;
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
class Pagerank {
  /**
   * @todo unused as of now ??
   */
	private _weighted: boolean;
	private _alpha: number;
	private _epsilon: number;
	private _maxIterations: number;
	// private _init           : number;
	private _normalize: boolean;
	private _personalized: boolean;

  /**
   * Holds all the data structures necessary to compute PR in LinAlg form
   */
	private _PRArrayDS: PRArrayDS;

	constructor(private _graph: IGraph, config?: PagerankRWConfig) {
		config = config || {}; // just so we don't get `property of undefined` errors below
		this._weighted = config.weighted || DEFAULT_WEIGHTED;
		this._alpha = config.alpha || DEFAULT_ALPHA;
		this._maxIterations = config.iterations || DEFAULT_MAX_ITERATIONS;
		this._epsilon = config.epsilon || DEFAULT_EPSILON;
		this._normalize = config.normalize || DEFAULT_NORMALIZE;
		// this._init = config.init ? config.init(this._graph) : defaultInit(this._graph);
		this._personalized = config.personalized ? config.personalized : false;

		if (this._personalized && !config.tele_set) {
			throw Error("Personalized Pagerank requires tele_set as a config argument");
		}

		if (config.init_map && Object.keys(config.init_map).length !== this._graph.nrNodes()) {
			throw Error("init_map config parameter must be of size |nodes|");
		}

		this._PRArrayDS = config.PRArrays || {
			curr: [],
			old: [],
			out_deg: [],
			pull: [],
			pull_weight: this._weighted ? [] : null,
			teleport: config.tele_set ? [] : null,
			tele_size: config.tele_set ? 0 : null
		}

    /**
     * Just for the purpose of testing
     * 
     * @todo but then the _graph constructor argument is useless - how to handle this??
     */
		config.PRArrays || this.constructPRArrayDataStructs(config);
		// logger.log(JSON.stringify(this._PRArrayDS));
	}


	getConfig() {
		return {
			_weighted: this._weighted,
			_alpha: this._alpha,
			_maxIterations: this._maxIterations,
			_epsilon: this._epsilon,
			_normalize: this._normalize,
			// _init: this._init
		}
	}


	getDSs() {
		return this._PRArrayDS;
	}


	constructPRArrayDataStructs(config: PagerankRWConfig) {
		let tic = +new Date;

		let nodes = this._graph.getNodes();
		let i = 0;
		let teleport_prob_sum = 0;
		let init_sum = 0;

		for (let key in nodes) {
			let node = this._graph.getNodeById(key);

			// set identifier to re-map later..
			node.setFeature('PR_index', i);

			if (config.init_map) {
				if (config.init_map[key] == null) {
					throw Error("initial value must be given for each node in the graph.");
				}
				let val = config.init_map[key];
				this._PRArrayDS.curr[i] = val;
				this._PRArrayDS.old[i] = val;
				init_sum += val;
			}
			else {
				this._PRArrayDS.curr[i] = defaultInit(this._graph);
				this._PRArrayDS.old[i] = defaultInit(this._graph);
			}

			this._PRArrayDS.out_deg[i] = node.outDegree() + node.degree();

      /**
       * @todo enhance this to actual weights!?
       * @todo networkX requires a dict the size of the inputs, which is cumbersome for larger graphs
       *       we want to do this smarter, but can we omit large parts of the (pseudo-)sparse matrix?
       *       - where pseudo-sparse means containing only implicit values (jump chances)
       */
			if (this._personalized) {
				let tele_prob_node = config.tele_set[node.getID()] || 0;
				this._PRArrayDS.teleport[i] = tele_prob_node;
				teleport_prob_sum += tele_prob_node;
				tele_prob_node && this._PRArrayDS.tele_size++;
			}
			++i;
		}

		// normalize init values
		if (config.init_map && init_sum !== 1) {
			this._PRArrayDS.curr = this._PRArrayDS.curr.map(n => n /= init_sum);
			this._PRArrayDS.old = this._PRArrayDS.old.map(n => n /= init_sum);
		}

		// normalize teleport probs
		if (this._personalized && teleport_prob_sum !== 1) {
			this._PRArrayDS.teleport = this._PRArrayDS.teleport.map(n => n /= teleport_prob_sum);
		}


    /**
     * We can only do this once all the mappings [node_id => arr_idx] have been established!
     */
		for (let key in nodes) {
			let node = this._graph.getNodeById(key);
			let node_idx = node.getFeature('PR_index');

			// set nodes to pull from
			let pull_i = [];
			let pull_weight_i = [];

			let incoming_edges = mergeObjects([node.inEdges(), node.undEdges()]);
			for (let edge_key in incoming_edges) {
				let edge: IBaseEdge = incoming_edges[edge_key];
				let source: IBaseNode = edge.getNodes().a;
				if (edge.getNodes().a.getID() == node.getID()) {
					source = edge.getNodes().b;
				}
				let parent_idx = source.getFeature('PR_index');
				if (this._weighted) {
					pull_weight_i.push(edge.getWeight());
				}
				pull_i.push(parent_idx);
			}
			this._PRArrayDS.pull[node_idx] = pull_i;

      /**
       * @todo test!
       */
			if (this._weighted) {
				this._PRArrayDS.pull_weight[node_idx] = pull_weight_i;
			}
		}

		let toc = +new Date;
		logger.log(`PR Array DS init took ${toc - tic} ms.`);
	}


	getRankMapFromArray() {
		let result: RankMap = {};
		let nodes = this._graph.getNodes();
		if (this._normalize) {
			this.normalizePR();
		}
		for (let key in nodes) {
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


  /**
   * method to produce 1D Array for passing to WASM / TF.js
   */
	pull2DTo1D(): Array<number> {
		let p1d = [];
		let p2d = this._PRArrayDS.pull;

		for (let n in p2d) {
			for (let i of p2d[n]) {
				p1d.push(i);
			}
			+n !== p2d.length - 1 && p1d.push(-1);
		}
		return p1d;
	}


	computePR() {
		const ds = this._PRArrayDS;
		// logger.log( JSON.stringify(ds) );

		const N = this._graph.nrNodes();

		// debug
		let visits = 0;

		for (let i = 0; i < this._maxIterations; ++i) {
			let delta_iter = 0.0;

			// node is number... !
			for (let node in ds.curr) {

				let pull_rank = 0;
				visits++;

				let idx = 0;
				for (let source of ds.pull[node]) {
					visits++;
          /**
           * This should never happen....
           * IF the data structure _PRArrayDS was properly constructed
           * 
           * @todo properly test _PRArrayDS as well as this beauty 
           *       (using a contrived, wrongly constructed pull 2D array)
           */
					if (ds.out_deg[source] === 0) {
						logger.log(`Node: ${node}`);
						logger.log(`Source: ${source} `);
						throw ('Encountered zero divisor!');
					}
					let weight = this._weighted ? ds.pull_weight[node][idx++] : 1.0;
					// logger.log(`Weight for ${source}->${node}: ${weight}`);
					pull_rank += ds.old[source] * weight / ds.out_deg[source];
				}

				let link_pr = (1 - this._alpha) * pull_rank;

				if (this._personalized) {
					let jump_chance = ds.teleport[node] / ds.tele_size; // 0/x = 0
					ds.curr[node] = link_pr + jump_chance;
				}
				else {
					// logger.log(`Pulling PR for node ${node}: ${link_pr  + this._alpha / N}`);
					ds.curr[node] = link_pr + this._alpha / N;
				}
				delta_iter += Math.abs(ds.curr[node] - ds.old[node]);
			}

			// logger.log( ds.curr );

			if (delta_iter <= this._epsilon) {
				// logger.log(`CONVERGED after ${i} iterations with ${visits} visits and a final delta of ${delta_iter}.`);
				return this.getRankMapFromArray();
			}

			ds.old = [...ds.curr];
		}

		// logger.log(`ABORTED after ${this._maxIterations} iterations with ${visits} visits.`);
		return this.getRankMapFromArray();
	}

}

export { Pagerank }
