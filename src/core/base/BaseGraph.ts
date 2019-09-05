import {DIR, GraphMode, GraphStats, NextArray, MinAdjacencyListArray, MinAdjacencyListDict} from '../interfaces';
import { IBaseNode, BaseNode } from './BaseNode';
import { BaseEdgeConfig, IBaseEdge, BaseEdge } from './BaseEdge';
import { prepareBFSStandardConfig, BFS, BFS_Scope } from '../../search/BFS';
import { DFS } from '../../search/DFS';
import { BellmanFordDict, BellmanFordArray } from '../../search/BellmanFord';
import { reWeighGraph, addExtraNandE} from '../../search/Johnsons';
import {TypedGraph} from "../typed/TypedGraph";


const DEFAULT_WEIGHT = 1;


export interface IGraph {
	/**
	 * Getters
	 */
	readonly label: string;
	readonly mode: GraphMode;
	readonly stats: GraphStats;

	getMode() : GraphMode;
	getStats() : GraphStats;

	// HISTOGRAM
	readonly inHist: Set<number>[];
	readonly outHist: Set<number>[];
	readonly connHist: Set<number>[];

	// NODES
	addNode(node: IBaseNode) : IBaseNode;
	addNodeByID(id: string, opts? : {}) : IBaseNode;
	hasNodeID(id: string) : boolean;
	getNodeById(id: string) : IBaseNode;
	n(id: string) : IBaseNode;
	getNodes() : {[key: string] : IBaseNode};
	nrNodes() : number;
	getRandomNode() : IBaseNode;
	deleteNode(node) : void;
	
	// EDGES
	addEdge(edge: IBaseEdge) : IBaseEdge;
	addEdgeByID(label: string, node_a : IBaseNode, node_b : IBaseNode, opts? : {}) : IBaseEdge;
	addEdgeByNodeIDs(label: string, node_a_id: string, node_b_id: string, opts? : {}) : IBaseEdge;
	hasEdgeID(id: string) : boolean;
	getEdgeById(id: string) : IBaseEdge;
	getDirEdgeByNodeIDs(node_a_id: string, node_b_id: string) : IBaseEdge;
	getUndEdgeByNodeIDs(node_a_id: string, node_b_id: string) : IBaseEdge;
	getDirEdges() : {[key: string] : IBaseEdge};
	getUndEdges() : {[key: string] : IBaseEdge};
	getDirEdgesArray(): Array<IBaseEdge>;
	getUndEdgesArray(): Array<IBaseEdge>;
	nrDirEdges() : number;
	nrUndEdges() : number;
	deleteEdge(edge: IBaseEdge) : void;
	getRandomDirEdge() : IBaseEdge;
	getRandomUndEdge() : IBaseEdge;

	// NEGATIVE EDGES AND CYCLES
	hasNegativeEdge(): boolean
	hasNegativeCycles(node? : IBaseNode) : boolean;

	// REINTERPRETING EDGES
	toDirectedGraph(copy?) : IGraph;
	toUndirectedGraph() : IGraph;

	// PROPERTIES
	pickRandomProperty(propList) : any;
	pickRandomProperties(propList, amount) : Array<string>;

	// HANDLE ALL EDGES OF NODES
	deleteInEdgesOf(node: IBaseNode) : void;
	deleteOutEdgesOf(node: IBaseNode) : void;
	deleteDirEdgesOf(node: IBaseNode) : void;
	deleteUndEdgesOf(node: IBaseNode) : void;
	deleteAllEdgesOf(node: IBaseNode) : void;

	// HANDLE ALL EDGES IN GRAPH
	clearAllDirEdges() : void;
	clearAllUndEdges() : void;
	clearAllEdges() : void;

	// CLONING
	cloneStructure() : IGraph;
	cloneSubGraphStructure(start:IBaseNode, cutoff:Number) : IGraph;

	// REPRESENTATIONS
	adjListDict(incoming?:boolean, include_self?,  self_dist?:number) : MinAdjacencyListDict;
	adjListArray(incoming?:boolean) : MinAdjacencyListArray;
	nextArray(incoming?:boolean) : NextArray;

	// REWEIGHTING
	reweighIfHasNegativeEdge(clone: boolean): IGraph;
}


class BaseGraph implements IGraph {
	protected _nr_nodes = 0;
	protected _nr_dir_edges = 0;
	protected _nr_und_edges = 0;
	protected _mode : GraphMode = GraphMode.INIT;
	protected _nodes : { [key: string] : IBaseNode } = {};
	protected _dir_edges : { [key: string] : IBaseEdge } = {};
	protected _und_edges : { [key: string] : IBaseEdge } = {};

	constructor (protected _label) {	}

	static isTyped(arg: any) : arg is TypedGraph {
		return !!arg.type;
	}

	get label(): string {
		return this._label;
	}

	get mode(): GraphMode {
		return this._mode;
	}

	get stats(): GraphStats {
		return this.getStats();
	}

	get inHist(): Set<number>[] {
		return this.degreeHist(DIR.in);
	}

	get outHist(): Set<number>[] {
		return this.degreeHist(DIR.out);
	}

	get connHist(): Set<number>[] {
		return this.degreeHist(DIR.unds);
	}

	private degreeHist(dir: string): Set<number>[] {
		let result = [];
		for ( let nid in this._nodes) {
			let node = this._nodes[nid];
			let deg;
			switch(dir) {
				case DIR.in:
					deg = node.inDegree();
					break;
				case DIR.out:
					deg = node.outDegree();
					break;
				default:
					deg = node.degree();
			}
			if ( !result[deg] ) {
				result[deg] = new Set([node]);
			}
			else {
				result[deg].add(node);
			}
		}
		return result;
	}
	
	/**
	 * 
	 * @param clone 
	 * 
	 * @comment Convenience method -
	 * Tests to be found in test suites for
	 * BaseGraph, BellmanFord and Johnsons
	 */
  reweighIfHasNegativeEdge(clone: boolean = false): IGraph {
    if (this.hasNegativeEdge()) {
      let result_graph : IGraph = clone ? this.cloneStructure() : this;

      let extraNode: IBaseNode = new BaseNode("extraNode");
      result_graph = addExtraNandE(result_graph, extraNode);
      let BFresult = BellmanFordDict(result_graph, extraNode);

      if (BFresult.neg_cycle) {
        throw new Error("The graph contains a negative cycle, thus it can not be processed");
      }
      else {
        let newWeights: {} = BFresult.distances;

        result_graph = reWeighGraph(result_graph, newWeights, extraNode);
        result_graph.deleteNode(extraNode);
      } 
      return result_graph;
    }
	}
	

	/**
	 * Version 1: do it in-place (to the object you receive)
	 * Version 2: clone the graph first, return the mutated clone
	 */
	toDirectedGraph(copy = false) : IGraph {
		let result_graph = copy ? this.cloneStructure() : this;
		// if graph has no edges, we want to throw an exception
		if ( this._nr_dir_edges === 0 && this._nr_und_edges === 0) {
			throw new Error("Cowardly refusing to re-interpret an empty graph.")
		}

		return result_graph;
	}


	/**
	 * @todo implement!!!
	 */
	toUndirectedGraph() : IGraph {

		return this;
	}

	/**
	 * what to do if some edges are not weighted at all?
	 * Since graph traversal algortihms (and later maybe graphs themselves)
	 * use default weights anyways, I am simply ignoring them for now...
	 * @todo figure out how to test this...
	 */
	hasNegativeEdge(): boolean {
		let has_neg_edge = false,
				edge: IBaseEdge;

		// negative und_edges are always negative cycles
		
		for (let edge_id in this._und_edges) {
			edge = this._und_edges[edge_id];
			if (!edge.isWeighted()) {
				continue;
			}
			if (edge.getWeight() < 0) {
				return true;
			}
		}
		for (let edge_id in this._dir_edges) {
			edge = this._dir_edges[edge_id];
			if (!edge.isWeighted()) {
				continue;
			}
			if (edge.getWeight() < 0) {
				has_neg_edge = true;
				break;
			}
		}
		return has_neg_edge;
	}

	
	/**
	 * Do we want to throw an error if an edge is unweighted?
	 * Or shall we let the traversal algorithm deal with DEFAULT weights like now?
	 */
	hasNegativeCycles(node?: IBaseNode): boolean {
		if ( !this.hasNegativeEdge() ) {
			return false;
		}

		let	negative_cycle = false,
				start = node ? node : this.getRandomNode();

		/**
		 * Now do Bellman Ford over all graph components
		 */
		DFS(this, start).forEach( comp => {
			let min_count = Number.POSITIVE_INFINITY,
					comp_start_node : string = "";

			Object.keys(comp).forEach( node_id => {
				if ( min_count > comp[node_id].counter ) {
					min_count = comp[node_id].counter;
					comp_start_node = node_id;
				}
			});

			if ( BellmanFordArray(this, this._nodes[comp_start_node]).neg_cycle ) {
				negative_cycle = true;
			}
		});

		return negative_cycle;
	}


	/**
	 * 
	 * @param incoming 
	 */
	nextArray(incoming:boolean = false) : NextArray {
		let next = [],
				node_keys = Object.keys(this._nodes);

		//?? - but AdjDict contains distance value only for the directly reachable neighbors for each node, not all!	
		//I do not understand but it works so it should be okay	
		const adjDict = this.adjListDict(incoming, true, 0);
		
		for ( let i = 0; i < this._nr_nodes; ++i ) {
			next.push([]);
			for ( let j = 0; j < this._nr_nodes; ++j ) {
				next[i].push([]);
				
				next[i][j].push( i === j ? j : isFinite(adjDict[node_keys[i]][node_keys[j]]) ? j : null );
			}
		}
		return next;
	}

	
	/**
	 * This function iterates over the adjDict in order to use it's advantage
	 * of being able to override edges if edges with smaller weights exist
	 * 
	 * However, the order of nodes in the array represents the order of nodes
	 * at creation time, no other implicit alphabetical or collational sorting.
	 * 
	 * This has to be considered when further processing the result
	 * 
	 * @param incoming whether or not to consider incoming edges as well
	 * @param include_self contains a distance to itself apart?
	 * @param self_dist default distance to self
	 */
	adjListArray(incoming:boolean = false, include_self = false, self_dist = 0) : MinAdjacencyListArray {
		let adjList = [],
				node_keys = Object.keys(this._nodes);

		const adjDict = this.adjListDict(incoming, true, 0);
		
		for ( let i = 0; i < this._nr_nodes; ++i ) {
			adjList.push([]);
			for ( let j = 0; j < this._nr_nodes; ++j ) {
				adjList[i].push( i === j ? 0 : isFinite(adjDict[node_keys[i]][node_keys[j]]) ? adjDict[node_keys[i]][node_keys[j]] : Number.POSITIVE_INFINITY );
			}
		}
		return adjList;
	}


	/**
	 * 
	 * @param incoming whether or not to consider incoming edges as well
	 * @param include_self contains a distance to itself apart?
	 * @param self_dist default distance to self
	 */
	adjListDict(incoming:boolean = false, include_self = false, self_dist = 0) : MinAdjacencyListDict {
		let adj_list_dict: MinAdjacencyListDict = {},
				nodes = this.getNodes(),
				cur_dist: number,
				key: string,
				cur_edge_weight: number;

		for ( key in nodes ) {
			adj_list_dict[key] = {};
			if ( include_self ) {
				adj_list_dict[key][key] = self_dist;
			}
		}
		for ( key in nodes ) {
			let neighbors = incoming ? nodes[key].reachNodes().concat(nodes[key].prevNodes()) : nodes[key].reachNodes();

			neighbors.forEach( (ne) => {
				cur_dist = adj_list_dict[key][ne.node.getID()] || Number.POSITIVE_INFINITY;
				cur_edge_weight = isNaN(ne.edge.getWeight()) ? DEFAULT_WEIGHT : ne.edge.getWeight();

				if ( cur_edge_weight < cur_dist ) {
					adj_list_dict[key][ne.node.getID()] = cur_edge_weight;

					if (incoming) { // we need to update the 'inverse' entry as well
						adj_list_dict[ne.node.getID()][key] = cur_edge_weight;
					}
				}
				else {
					adj_list_dict[key][ne.node.getID()] = cur_dist;

					if (incoming) { // we need to update the 'inverse' entry as well
						adj_list_dict[ne.node.getID()][key] = cur_dist;
					}
				}
			});
		}
		return adj_list_dict;
	}


	getMode() : GraphMode {
		return this._mode;
	}


	getStats() : GraphStats {
		return {
			mode: this._mode,
			nr_nodes: this._nr_nodes,
			nr_und_edges: this._nr_und_edges,
			nr_dir_edges: this._nr_dir_edges,
			density_dir: this._nr_dir_edges / ( this._nr_nodes * ( this._nr_nodes - 1 ) ),
			density_und: 2* this._nr_und_edges / ( this._nr_nodes * ( this._nr_nodes - 1 ) )
		}
	}

	nrNodes() : number {
		return this._nr_nodes;
	}

	nrDirEdges() : number {
		return this._nr_dir_edges;
	}

	nrUndEdges() : number {
		return this._nr_und_edges;
	}

	/**
	 * 
	 * @param id 
	 * @param opts
	 * 
	 * @todo addNode functions should check if a node with a given ID already exists -> node IDs have to be unique... 
	 */
	addNodeByID(id: string, opts? : {}) : IBaseNode {
		if ( this.hasNodeID( id ) ) {
			throw new Error("Won't add node with duplicate ID.");
		}
		let node = new BaseNode(id, opts);
		return this.addNode(node) ? node : null;
	}

	addNode(node: IBaseNode) : IBaseNode {
		if ( this.hasNodeID( node.getID() ) ) {
			throw new Error("Won't add node with duplicate ID.");
		}
		this._nodes[node.getID()] = node;
		this._nr_nodes += 1;
		return node;
	}

	hasNodeID(id: string) : boolean {
		return !!this._nodes[id];
	}

	getNodeById(id: string) : IBaseNode {
		return this._nodes[id];
	}

	n(id: string) : IBaseNode {
		return this.getNodeById(id);
	}

	getNodes() : {[key: string] : IBaseNode} {
		return this._nodes;
	}

	/**
	 * CAUTION - This function takes linear time in # nodes
	 */
	getRandomNode() : IBaseNode {
		return this.pickRandomProperty(this._nodes);
	}

	deleteNode(node) : void {
		let rem_node = this._nodes[node.getID()];
		if ( !rem_node ) {
			throw new Error('Cannot remove a foreign node.');
		}
		// Edges?
		let in_deg = node.inDegree();
		let out_deg = node.outDegree();
		let deg = node.degree();

		// Delete all edges brutally...
		if ( in_deg ) {
			this.deleteInEdgesOf(node);
		}
		if ( out_deg ) {
			this.deleteOutEdgesOf(node);
		}
		if ( deg ) {
			this.deleteUndEdgesOf(node);
		}

		delete this._nodes[node.getID()];
		this._nr_nodes -= 1;
	}

	hasEdgeID(id: string) : boolean {
		return !!this._dir_edges[id] || !!this._und_edges[id];
	}

	getEdgeById(id: string) : IBaseEdge {
		let edge = this._dir_edges[id] || this._und_edges[id];
		if ( !edge ) {
			throw new Error("cannot retrieve edge with non-existing ID.");
		}
		return edge;
	}

	static checkExistanceOfEdgeNodes(node_a: IBaseNode, node_b: IBaseNode) : void {
		if ( !node_a ) {
			throw new Error(`Cannot find edge. Node A does not exist (in graph).`);
		}
		if ( !node_b ) {
			throw new Error("Cannot find edge. Node B does not exist (in graph).");
		}
	}

	// get the edge from node_a to node_b (or undirected)
	getDirEdgeByNodeIDs(node_a_id: string, node_b_id: string) {
		const node_a = this.getNodeById(node_a_id);
		const node_b = this.getNodeById(node_b_id);
		BaseGraph.checkExistanceOfEdgeNodes(node_a, node_b);

		// check for outgoing directed edges
		let edges_dir = node_a.outEdges(),
				edges_dir_keys = Object.keys(edges_dir);
		
		for (let i = 0; i < edges_dir_keys.length; i++) {
		    let edge = edges_dir[edges_dir_keys[i]];
				if (edge.getNodes().b.getID() == node_b_id) {
				    return edge;
				}
		}

		// if we managed to arrive here, there is no edge!
		throw new Error(`Cannot find edge. There is no edge between Node ${node_a_id} and ${node_b_id}.`);
	}

	getUndEdgeByNodeIDs(node_a_id: string, node_b_id: string) {
		const node_a = this.getNodeById(node_a_id);
		const node_b = this.getNodeById(node_b_id);
		BaseGraph.checkExistanceOfEdgeNodes(node_a, node_b);

		// check for undirected edges
		let edges_und = node_a.undEdges(),
		edges_und_keys = Object.keys(edges_und);

		for (let i = 0; i < edges_und_keys.length; i++) {
		    let edge = edges_und[edges_und_keys[i]];
				let b: string;
				(edge.getNodes().a.getID() == node_a_id) ? (b = edge.getNodes().b.getID()) : (b = edge.getNodes().a.getID());
				if (b == node_b_id) {
				    return edge;
				}
		}
	}

	getDirEdges() : {[key: string] : IBaseEdge} {
		return this._dir_edges;
	}

	getUndEdges() : {[key: string] : IBaseEdge} {
		return this._und_edges;
	}

	getDirEdgesArray(): Array<IBaseEdge> {
		let edges = [];
		for (let e_id in this._dir_edges) {
			edges.push(this._dir_edges[e_id]);
		}
		return edges;
	}

	getUndEdgesArray(): Array<IBaseEdge> {
		let edges = [];
		for (let e_id in this._und_edges) {
			edges.push(this._und_edges[e_id]);
		}
		return edges;
	}

	addEdgeByNodeIDs(label: string, node_a_id: string, node_b_id: string, opts? : {}) : IBaseEdge {
		let node_a = this.getNodeById(node_a_id),
				node_b = this.getNodeById(node_b_id);
		if ( !node_a ) {
			throw new Error("Cannot add edge. Node A does not exist");
		}
		else if ( !node_b ) {
			throw new Error("Cannot add edge. Node B does not exist");
		}
		else {
			return this.addEdgeByID(label, node_a, node_b, opts);
		}
	}

	/**
	 * @description now all test cases pertaining addEdge() call this one...
	 */
	addEdgeByID(id: string, node_a : IBaseNode, node_b : IBaseNode, opts? : BaseEdgeConfig) : IBaseEdge {
		let edge = new BaseEdge(id, node_a, node_b, opts || {});
		return this.addEdge(edge) ? edge : null;
	}

	/**
	 * @todo test cases should be reversed / completed
	 * @todo make transactional
	 */
	addEdge(edge: IBaseEdge) : IBaseEdge {
		let node_a = edge.getNodes().a,
				node_b = edge.getNodes().b;

		if ( !this.hasNodeID(node_a.getID()) || !this.hasNodeID(node_b.getID()) 
					|| this._nodes[node_a.getID()] !== node_a || this._nodes[node_b.getID()] !== node_b
			 ) {
			throw new Error("can only add edge between two nodes existing in graph");
		}

		// connect edge to first node anyways
		node_a.addEdge(edge);

		if ( edge.isDirected() ) {
			// add edge to second node too
			node_b.addEdge(edge);
			this._dir_edges[edge.getID()] = edge;
			this._nr_dir_edges += 1;
			this.updateGraphMode();
		}
		else {
			// add edge to both nodes, except they are the same...
			if ( node_a !== node_b ) {
				node_b.addEdge(edge);
			}
			this._und_edges[edge.getID()] = edge;
			this._nr_und_edges += 1;
			this.updateGraphMode();
		}
		return edge;
	}

	deleteEdge(edge: IBaseEdge) : void {
		let dir_edge = this._dir_edges[edge.getID()];
		let und_edge = this._und_edges[edge.getID()];

		if ( !dir_edge && !und_edge ) {
			throw new Error('cannot remove non-existing edge.');
		}

		let nodes = edge.getNodes();
		nodes.a.removeEdge(edge);
		if ( nodes.a !== nodes.b ) {
				nodes.b.removeEdge(edge);
		}

		if ( dir_edge ) {
			delete this._dir_edges[edge.getID()];
			this._nr_dir_edges -=1;
		}
		else {
			delete this._und_edges[edge.getID()];
			this._nr_und_edges -=1;
		}

		this.updateGraphMode();
	}

	// Some atomicity / rollback feature would be nice here...
	deleteInEdgesOf(node: IBaseNode) : void {
		this.checkConnectedNodeOrThrow(node);
		let in_edges = node.inEdges();
		let key 	: string,
				edge	: IBaseEdge;

		for (key in in_edges) {
			edge = in_edges[key];
			edge.getNodes().a.removeEdge(edge);
			delete this._dir_edges[edge.getID()];
			this._nr_dir_edges -=1;
		}
		node.clearInEdges();
		this.updateGraphMode();
	}

	// Some atomicity / rollback feature would be nice here...
	deleteOutEdgesOf(node: IBaseNode) : void {
		this.checkConnectedNodeOrThrow(node);
		let out_edges = node.outEdges();
		let key 	: string,
				edge	: IBaseEdge;

		for (key in out_edges) {
			edge = out_edges[key];
			edge.getNodes().b.removeEdge(edge);
			delete this._dir_edges[edge.getID()];
			this._nr_dir_edges -=1;
		}
		node.clearOutEdges();
		this.updateGraphMode();
	}

	// Some atomicity / rollback feature would be nice here...
	deleteDirEdgesOf(node: IBaseNode) : void {
		this.deleteInEdgesOf(node);
		this.deleteOutEdgesOf(node);
	}

	// Some atomicity / rollback feature would be nice here...
	deleteUndEdgesOf(node: IBaseNode) : void {
		this.checkConnectedNodeOrThrow(node);
		let und_edges = node.undEdges();
		let key 	: string,
				edge	: IBaseEdge;

		for (key in und_edges) {
			edge = und_edges[key];
			let conns = edge.getNodes();
			conns.a.removeEdge(edge);
			if ( conns.a !== conns.b ) {
				conns.b.removeEdge(edge);
			}
			delete this._und_edges[edge.getID()];
			this._nr_und_edges -=1;
		}
		node.clearUndEdges();
		this.updateGraphMode();
	}

	// Some atomicity / rollback feature would be nice here...
	deleteAllEdgesOf(node: IBaseNode) : void {
		this.deleteDirEdgesOf(node);
		this.deleteUndEdgesOf(node);
	}

	/**
	 * Remove all the (un)directed edges in the graph
	 */
	clearAllDirEdges() : void {
		for (let edge in this._dir_edges) {
			this.deleteEdge(this._dir_edges[edge]);
		}
	}

	clearAllUndEdges() : void {
		for (let edge in this._und_edges) {
			this.deleteEdge(this._und_edges[edge]);
		}
	}

	clearAllEdges() : void {
		this.clearAllDirEdges();
		this.clearAllUndEdges();
	}


	/**
	 * CAUTION - This function is linear in # directed edges
	 */
	getRandomDirEdge() : IBaseEdge {
		return this.pickRandomProperty(this._dir_edges);
	}

	/**
	 * CAUTION - This function is linear in # undirected edges
	 */
	getRandomUndEdge() : IBaseEdge {
		return this.pickRandomProperty(this._und_edges);
	}


	cloneStructure() : IGraph {
		let new_graph = new BaseGraph(this._label),
				old_nodes = this.getNodes(),
				old_edge : IBaseEdge,
				new_node_a  = null,
				new_node_b  = null;

		for ( let node_id in old_nodes ) {
			new_graph.addNode( old_nodes[node_id].clone() );
		}

		[this.getDirEdges(), this.getUndEdges()].forEach( (old_edges) => {
			for ( let edge_id in old_edges ) {
				old_edge = old_edges[edge_id];
				new_node_a = new_graph.getNodeById( old_edge.getNodes().a.getID() );
				new_node_b = new_graph.getNodeById( old_edge.getNodes().b.getID() );
				new_graph.addEdge( old_edge.clone(new_node_a, new_node_b) )
			}
		});

		return new_graph;
	}

	cloneSubGraphStructure(root:IBaseNode, cutoff:Number) : IGraph{
		let new_graph = new BaseGraph(this._label);

		let config = prepareBFSStandardConfig();

		let bfsNodeUnmarkedTestCallback = function(context: BFS_Scope) {
			if(config.result[context.next_node.getID()].counter>cutoff){
				context.queue = [];
			} else { //This means we only add cutoff -1 nodes to the cloned graph, # of nodes is then equal to cutoff
				new_graph.addNode(context.next_node.clone());
			}
		};
		config.callbacks.node_unmarked.push(bfsNodeUnmarkedTestCallback);
		BFS(this, root, config);
		let old_edge : IBaseEdge,
			new_node_a  = null,
			new_node_b  = null;

		[this.getDirEdges(), this.getUndEdges()].forEach( (old_edges) => {
			for ( let edge_id in old_edges ) {
				old_edge = old_edges[edge_id];
				new_node_a = new_graph.getNodeById( old_edge.getNodes().a.getID() );
				new_node_b = new_graph.getNodeById( old_edge.getNodes().b.getID() );
				if(new_node_a != null && new_node_b != null)
					new_graph.addEdge( old_edge.clone(new_node_a, new_node_b) );
			}
		});

		return new_graph;
	}


	protected checkConnectedNodeOrThrow(node : IBaseNode) {
		let inGraphNode = this._nodes[node.getID()];
		if ( !inGraphNode ) {
			throw new Error('Cowardly refusing to delete edges of a foreign node.');
		}
	}


	protected updateGraphMode() {
		let nr_dir = this._nr_dir_edges,
			nr_und = this._nr_und_edges;

		if ( nr_dir && nr_und  ) {
			this._mode = GraphMode.MIXED;
		}
		else if ( nr_dir ) {
			this._mode = GraphMode.DIRECTED;
		}
		else if ( nr_und ) {
			this._mode = GraphMode.UNDIRECTED;
		}
		else {
			this._mode = GraphMode.INIT;
		}
	}


	pickRandomProperty(propList) : any {
		let tmpList = Object.keys(propList);
		let randomPropertyName = tmpList[ Math.floor(Math.random()*tmpList.length) ];
		return propList[randomPropertyName];
	}


	/**
	 * In some cases we need to give back a large number of objects
	 * in one swoop, as calls to Object.keys() are really slow
	 * for large input objects.
	 *
	 * In order to do this, we only extract the keys once and then
	 * iterate over the key list and add them to a result array
	 * with probability = amount / keys.length
	 * 
	 * We also mark all used keys in case we haven't picked up
	 * enough entities for the result array after the first round.
	 * We then just fill up the rest of the result array linearly
	 * with as many unused keys as necessary
	 * 
	 * 
	 * @todo include generic Test Cases
	 * @todo check if amount is larger than propList size
	 * @todo This seems like a simple hack - filling up remaining objects
	 * Could be replaced by a better fraction-increasing function above...
	 * 
	 * @param propList
	 * @param amount
	 * @returns {Array}
	 */
	pickRandomProperties(propList, amount) : Array<string> {
		let ids = [];
		let keys = Object.keys(propList);
		let fraction = amount / keys.length;
		let used_keys = {};

		for ( let i = 0; ids.length < amount && i < keys.length; i++ ) {
			if ( Math.random() < fraction ) {
				ids.push( keys[i] );
				used_keys[keys[i]] = i;
			}
		}

		let diff = amount - ids.length;
		for ( let i = 0; i < keys.length && diff; i++ ) {
			if ( used_keys[keys[i]] == null) {
				ids.push( keys[i] );
				diff--;
			}
		}

		return ids;
	}

}

export {BaseGraph};
