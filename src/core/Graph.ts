/// <reference path="../../typings/tsd.d.ts" />

import * as $N from './Nodes';
import * as $E from './Edges';
import * as randgen from '../utils/randGenUtils';
import * as $DS from '../utils/structUtils';
import { Logger } from '../utils/logger';

let logger : Logger = new Logger();


export enum GraphMode {
	INIT,
	DIRECTED,
	UNDIRECTED,
	MIXED
}


export interface DegreeDistribution {
	in	: Uint16Array;
	out	: Uint16Array;
	dir	: Uint16Array;
	und	: Uint16Array;
	all	: Uint16Array;
}


export interface GraphStats {
	mode					: GraphMode;
	nr_nodes			: number;
	nr_und_edges	: number;
	nr_dir_edges	: number;
}

/**
 * Only gives the best distance to a node in case of multiple direct edges
 */
export type MinAdjacencyListDict = {[id: string]: MinAdjacencyListDictEntry};

export type MinAdjacencyListDictEntry = {[id: string] : number};

export type MinAdjacencyListArray = Array<Array<number>>;


export interface IGraph {
	_label : string;

	getMode() : GraphMode;
	getStats() : GraphStats;
	degreeDistribution() : DegreeDistribution;

	// NODE STUFF
	addNodeByID(id: string, opts? : {}) : $N.IBaseNode;
	addNode(node: $N.IBaseNode) : boolean;
	hasNodeID(id: string) : boolean;
	hasNodeLabel(label: string) : boolean;
	getNodeById(id: string) : $N.IBaseNode;
	getNodeByLabel(label: string) : $N.IBaseNode;
	getNodes() : {[key: string] : $N.IBaseNode};
	nrNodes() : number;
	getRandomNode() : $N.IBaseNode;
	deleteNode(node) : void;

	// EDGE STUFF
	addEdgeByID(label: string, node_a : $N.IBaseNode, node_b : $N.IBaseNode, opts? : {}) : $E.IBaseEdge;
	addEdge(edge: $E.IBaseEdge) : $E.IBaseEdge;

	addEdgeByNodeIDs(label: string, node_a_id: string, node_b_id: string, opts? : {}) : $E.IBaseEdge;
	hasEdgeID(id: string) : boolean;
	hasEdgeLabel(label: string) : boolean;
	getEdgeById(id: string) : $E.IBaseEdge;
	getEdgeByLabel(label: string) : $E.IBaseEdge;
	getEdgeByNodeIDs(node_a_id: string, node_b_id: string) : $E.IBaseEdge;
	getDirEdges() : {[key: string] : $E.IBaseEdge};
	getUndEdges() : {[key: string] : $E.IBaseEdge};
	nrDirEdges() : number;
	nrUndEdges() : number;
	deleteEdge(edge: $E.IBaseEdge) : void;
	getRandomDirEdge() : $E.IBaseEdge;
	getRandomUndEdge() : $E.IBaseEdge;
	pickRandomProperty(propList) : any;
	pickRandomProperties(propList, amount) : Array<string>;


	// HANDLE ALL EDGES OF NODES
	deleteInEdgesOf(node: $N.IBaseNode) : void;
	deleteOutEdgesOf(node: $N.IBaseNode) : void;
	deleteDirEdgesOf(node: $N.IBaseNode) : void;
	deleteUndEdgesOf(node: $N.IBaseNode) : void;
	deleteAllEdgesOf(node: $N.IBaseNode) : void;

	// HANDLE ALL EDGES IN GRAPH
	clearAllDirEdges() : void;
	clearAllUndEdges() : void;
	clearAllEdges() : void;

	clone() : IGraph;
	adjListDict(incoming?:boolean, include_self?:boolean, self_dist?:number) : MinAdjacencyListDict;
	adjListArray(incoming?:boolean, include_self?:boolean, self_dist?:number) : MinAdjacencyListArray;

  // RANDOM STUFF
	pickRandomProperty(propList) : any;
	pickRandomProperties(propList, amount) : Array<string>;
}


class BaseGraph implements IGraph {
	private _nr_nodes = 0;
	private _nr_dir_edges = 0;
	private _nr_und_edges = 0;
	protected _mode : GraphMode = GraphMode.INIT;
	protected _nodes : { [key: string] : $N.IBaseNode } = {};
	protected _dir_edges : { [key: string] : $E.IBaseEdge } = {};
	protected _und_edges : { [key: string] : $E.IBaseEdge } = {};

  // protected _typed_nodes: { [type: string] : { [key: string] : $N.IBaseNode } };
  // protected _typed_dir_edges: { [type: string] : { [key: string] : $E.IBaseEdge } };
  // protected _typed_und_edges: { [type: string] : { [key: string] : $E.IBaseEdge } };

	constructor (public _label) {	}


	/**
	 * This function iterates over the adjDict in order to use it's advantage
	 * of being able to override edges if edges with smaller weight exist
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
	adjListArray(incoming:boolean = false, include_self:boolean = false, self_dist?:number) : MinAdjacencyListArray {
		let adjList = [],
				idx = 0;
		const adjDict = this.adjListDict(incoming, include_self, self_dist || 0);

		for ( let i in adjDict ) {
			adjList.push([]);
			for ( let j in adjDict ) {
				adjList[idx].push( isFinite(adjDict[i][j]) ? adjDict[i][j] : Number.POSITIVE_INFINITY );	
			}
			++idx;
		}
		return adjList;
	}


	/**
	 * 
	 * @param incoming whether or not to consider incoming edges as well
	 * @param include_self contains a distance to itself apart?
	 * @param self_dist default distance to self
	 */
	adjListDict(incoming:boolean = false, include_self:boolean = false, self_dist?:number) : MinAdjacencyListDict{
		self_dist = self_dist || 0;
		let adj_list_dict: MinAdjacencyListDict = {},
				nodes = this.getNodes(),
				weight: number;
		for (let key in nodes) {
			adj_list_dict[key] = {};
		}		
		for ( var key in nodes ) {
			let neighbors = incoming ? nodes[key].reachNodes().concat(nodes[key].prevNodes()) : nodes[key].reachNodes();

			neighbors.forEach( (ne) => {
				weight = adj_list_dict[key][ne.node.getID()] || Number.POSITIVE_INFINITY;

				if ( ne.edge.getWeight() < weight ) {
					adj_list_dict[key][ne.node.getID()] = ne.edge.getWeight();

					if (incoming) { // we need to update the 'inverse' entry as well
						adj_list_dict[ne.node.getID()][key] = ne.edge.getWeight();
					}
				}
				else {
					adj_list_dict[key][ne.node.getID()] = weight;

					if (incoming) { // we need to update the 'inverse' entry as well
						adj_list_dict[ne.node.getID()][key] = weight;
					}
				}
			});
		}
		if ( include_self ) {
			for ( var node_key in nodes ) {
				if ( adj_list_dict[node_key][node_key] == null ) {
					adj_list_dict[node_key][node_key] = self_dist;
				}
			}
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
			nr_dir_edges: this._nr_dir_edges
		}
	}

	/**
	 * We assume graphs in which no node has higher total degree than 65536
	 */
	degreeDistribution() : DegreeDistribution {
		var max_deg : number = 0,
				key			: string,
				node 		: $N.IBaseNode,
				all_deg : number;

		for ( key in this._nodes ) {
			node = this._nodes[key];
			all_deg = node.inDegree() + node.outDegree() + node.degree() + 1;
			max_deg =  all_deg > max_deg ? all_deg : max_deg;
		}

		var deg_dist : DegreeDistribution = {
			in:  new Uint16Array(max_deg),
			out: new Uint16Array(max_deg),
			dir: new Uint16Array(max_deg),
			und: new Uint16Array(max_deg),
			all: new Uint16Array(max_deg)
		};

		for ( key in this._nodes ) {
			node = this._nodes[key];
			deg_dist.in[node.inDegree()]++;
			deg_dist.out[node.outDegree()]++;
			deg_dist.dir[node.inDegree() + node.outDegree()]++;
			deg_dist.und[node.degree()]++;
			deg_dist.all[node.inDegree() + node.outDegree() + node.degree()]++;
		}
		// console.dir(deg_dist);
		return deg_dist;
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

	addNodeByID(id: string, opts? : {}) : $N.IBaseNode {
		var node = new $N.BaseNode(id, opts);
		return this.addNode(node) ? node : null;
	}

	addNode(node: $N.IBaseNode) : boolean {
		this._nodes[node.getID()] = node;
		this._nr_nodes += 1;
		return true;
	}

	hasNodeID(id: string) : boolean {
		return !!this._nodes[id];
	}

	/**
	 * Use hasNodeLabel with CAUTION ->
	 * it has LINEAR runtime in the graph's #nodes
	 */
	hasNodeLabel(label: string) : boolean {
		return !!$DS.findKey(this._nodes, function(node : $N.IBaseNode) {
			return node.getLabel() === label;
		});
	}

	getNodeById(id: string) : $N.IBaseNode {
		return this._nodes[id];
	}

	/**
	 * Use getNodeByLabel with CAUTION ->
	 * it has LINEAR runtime in the graph's #nodes
	 */
	getNodeByLabel(label: string) : $N.IBaseNode {
		var id = $DS.findKey(this._nodes, function(node : $N.IBaseNode) {
			return node.getLabel() === label;
		});
		return this._nodes[id];
	}

	getNodes() : {[key: string] : $N.IBaseNode} {
		return this._nodes;
	}

	/**
	 * CAUTION - This function takes linear time in # nodes
	 */
	getRandomNode() : $N.IBaseNode {
		return this.pickRandomProperty(this._nodes);
	}

	deleteNode(node) : void {
		var rem_node = this._nodes[node.getID()];
		if ( !rem_node ) {
			throw new Error('Cannot remove un-added node.');
		}
		// Edges?
		var in_deg = node.inDegree();
		var out_deg = node.outDegree();
		var deg = node.degree();

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

	/**
	 * Use hasEdgeLabel with CAUTION ->
	 * it has LINEAR runtime in the graph's #edges
	 */
	hasEdgeLabel(label: string) : boolean {
		var dir_id = $DS.findKey(this._dir_edges, function(edge : $E.IBaseEdge) {
			return edge.getLabel() === label;
		});
		var und_id = $DS.findKey(this._und_edges, function(edge : $E.IBaseEdge) {
			return edge.getLabel() === label;
		});
		return !!dir_id || !!und_id;
	}

	getEdgeById(id: string) : $E.IBaseEdge {
		var edge = this._dir_edges[id] || this._und_edges[id];
		if ( !edge ) {
			throw new Error("cannot retrieve edge with non-existing ID.");
		}
		return edge;
	}

	/**
	 * Use hasEdgeLabel with CAUTION ->
	 * it has LINEAR runtime in the graph's #edges
	 */
	getEdgeByLabel(label: string) : $E.IBaseEdge {
		var dir_id = $DS.findKey(this._dir_edges, function(edge : $E.IBaseEdge) {
			return edge.getLabel() === label;
		});
		var und_id = $DS.findKey(this._und_edges, function(edge : $E.IBaseEdge) {
			return edge.getLabel() === label;
		});
		var edge = this._dir_edges[dir_id] || this._und_edges[und_id];
		if ( !edge ) {
			throw new Error("cannot retrieve edge with non-existing Label.");
		}
		return edge;
	}

	// get the edge from node_a to node_b (or undirected)
	getEdgeByNodeIDs(node_a_id: string, node_b_id: string) {
		var node_a = this.getNodeById(node_a_id);
		if ( !node_a ) {
			throw new Error("Cannot find edge. Node A does not exist");
		}
		var node_b = this.getNodeById(node_b_id);
		if ( !node_b ) {
			throw new Error("Cannot find edge. Node B does not exist");
		}
		// check for outgoing directed edges
		var edges_dir = node_a.outEdges();
		for (let i = 0; i < Object.keys(edges_dir).length; i++) {
		    var edge = edges_dir[Object.keys(edges_dir)[i]];
				if (edge.getNodes().b.getID() == node_b_id) {
				    return edge;
				}
		}
		// check for undirected edges
		var edges_und = node_a.undEdges();
		for (let i = 0; i < Object.keys(edges_und).length; i++) {
		    var edge = edges_und[Object.keys(edges_und)[i]];
				var b: string;
				(edge.getNodes().a.getID() == node_a_id) ? (b = edge.getNodes().b.getID()) : (b = edge.getNodes().a.getID());
				if (b == node_b_id) {
				    return edge;
				}
		}
		// if we managed to go up to here, there is no edge!
		throw new Error("Cannot find edge. There is no edge between Node " + node_a_id +  " and " + node_b_id);
	}

	getDirEdges() : {[key: string] : $E.IBaseEdge} {
		return this._dir_edges;
	}

	getUndEdges() : {[key: string] : $E.IBaseEdge} {
		return this._und_edges;
	}

	addEdgeByNodeIDs(label: string, node_a_id: string, node_b_id: string, opts? : {}) : $E.IBaseEdge {
		var node_a = this.getNodeById(node_a_id),
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
	 * Now all test cases pertaining addEdge() call this one...
	 */
	addEdgeByID(id: string, node_a : $N.IBaseNode, node_b : $N.IBaseNode, opts? : $E.EdgeConstructorOptions) : $E.IBaseEdge {
		let edge = new $E.BaseEdge(id, node_a, node_b, opts || {});
		return this.addEdge(edge);
	}

	/**
	 * Test cases should be reversed / completed
	 */
	addEdge(edge: $E.IBaseEdge) : $E.IBaseEdge {
		let node_a = edge.getNodes().a,
				node_b = edge.getNodes().b;

		if ( !this.hasNodeID(node_a.getID()) || !this.hasNodeID(node_b.getID()) ) {
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

	deleteEdge(edge: $E.IBaseEdge) : void {
		var dir_edge = this._dir_edges[edge.getID()];
		var und_edge = this._und_edges[edge.getID()];

		if ( !dir_edge && !und_edge ) {
			throw new Error('cannot remove non-existing edge.');
		}

		var nodes = edge.getNodes();
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
	deleteInEdgesOf(node: $N.IBaseNode) : void {
		this.checkConnectedNodeOrThrow(node);
		var in_edges = node.inEdges();
		var key 	: string,
				edge	: $E.IBaseEdge;

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
	deleteOutEdgesOf(node: $N.IBaseNode) : void {
		this.checkConnectedNodeOrThrow(node);
		var out_edges = node.outEdges();
		var key 	: string,
				edge	: $E.IBaseEdge;

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
	deleteDirEdgesOf(node: $N.IBaseNode) : void {
		this.deleteInEdgesOf(node);
		this.deleteOutEdgesOf(node);
	}

	// Some atomicity / rollback feature would be nice here...
	deleteUndEdgesOf(node: $N.IBaseNode) : void {
		this.checkConnectedNodeOrThrow(node);
		var und_edges = node.undEdges();
		var key 	: string,
				edge	: $E.IBaseEdge;

		for (key in und_edges) {
			edge = und_edges[key];
			var conns = edge.getNodes();
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
	deleteAllEdgesOf(node: $N.IBaseNode) : void {
		this.deleteDirEdgesOf(node);
		this.deleteUndEdgesOf(node);
	}

	/**
	 * Remove all the (un)directed edges in the graph
	 */
	clearAllDirEdges() : void {
		for (var edge in this._dir_edges) {
			this.deleteEdge(this._dir_edges[edge]);
		}
	}

	clearAllUndEdges() : void {
		for (var edge in this._und_edges) {
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
	getRandomDirEdge() : $E.IBaseEdge {
		return this.pickRandomProperty(this._dir_edges);
	}

	/**
	 * CAUTION - This function is linear in # undirected edges
	 */
	getRandomUndEdge() : $E.IBaseEdge {
		return this.pickRandomProperty(this._und_edges);
	}


	clone() : IGraph {
		let new_graph = new BaseGraph(this._label),
				old_nodes = this.getNodes(),
				old_edge : $E.IBaseEdge,
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


	protected checkConnectedNodeOrThrow(node : $N.IBaseNode) {
		var node = this._nodes[node.getID()];
		if ( !node ) {
			throw new Error('Cowardly refusing to delete edges of un-added node.');
		}
	}


	protected updateGraphMode() {
		var nr_dir = this._nr_dir_edges,
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
	 * In order to do this, we
	 *
	 * @param propList
	 * @param fraction
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

		// Simple hack - filling up remaining objects (if any)
		// Could be replaced by a much better fraction-increasing function above
		// But too tired now...
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
