/// <reference path="../../typings/tsd.d.ts" />

import * as $N from './Nodes';
import * as $E from './Edges';
import _ = require('lodash');


enum GraphMode {
	INIT, 
	DIRECTED, 
	UNDIRECTED, 
	MIXED
};


interface GraphStats {
	nr_nodes			: number;
	nr_und_edges	: number;
	nr_dir_edges	: number;
};


interface IGraph {
	_label : string;
	
	getMode() : GraphMode;
	getStats() : GraphStats;
	
	addNode(label: string) : $N.IBaseNode;
	hasNodeID(id: number) : boolean;
	hasNodeLabel(label: string) : boolean;
	getNodeById(id: number) : $N.IBaseNode;
	getNodeByLabel(label: string) : $N.IBaseNode;
	nrNodes() : number;
	getRandomNode() : $N.IBaseNode;
	// get all nodes??
	
	addEdge(label: string, node_a : $N.IBaseNode, node_b : $N.IBaseNode, opts? : {}) : $E.IBaseEdge;
	hasEdgeID(id: number) : boolean;
	hasEdgeLabel(label: string) : boolean;
	getEdgeById(id: number) : $E.IBaseEdge;
	getEdgeByLabel(label: string) : $E.IBaseEdge;
	nrDirEdges() : number;
	nrUndEdges() : number;
	// nrEdges() : number;
	removeEdge(edge: $E.IBaseEdge) : void;
	getRandomDirEdge() : $E.IBaseEdge;
	getRandomUndEdge() : $E.IBaseEdge;
	
	// some Algorithms require random start nodes...
	// getRandomNode() : $N.IBaseNode;
	// some Algorithms require random start edges...?
	// getRandomEdge() : $E.IBaseEdge;
}


class BaseGraph implements IGraph {
	protected _mode : GraphMode = GraphMode.INIT;
	protected _node_count : number = 0;
	protected _dir_edge_count : number = 0;
	protected _und_edge_count : number = 0;
	protected _nodes : { [key: number] : $N.IBaseNode } = {};
	protected _dir_edges : { [key: number] : $E.IBaseEdge } = {};
	protected _und_edges : { [key: number] : $E.IBaseEdge } = {};
	
	
	constructor (public _label) {
	}
	
	getMode() : GraphMode {
		return this._mode;
	}
	
	addNode(label: string) : $N.IBaseNode {
		var node = new $N.BaseNode(this._node_count++, label);
		this._nodes[node.getID()] = node;		
		return node;
	}
	
	hasNodeID(id: number) : boolean {
		return !!this._nodes[id];
	}
	
	/**
	 * Use hasNodeLabel with CAUTION -> 
	 * it has LINEAR runtime in the graph's #nodes
	 */
	hasNodeLabel(label: string) : boolean {
		return !!_.findKey(this._nodes, function(node : $N.IBaseNode) {
			return node.getLabel() === label;
		});
	}
	
	getNodeById(id: number) : $N.IBaseNode {
		var node = this._nodes[id];
		if ( !node ) {
			throw new Error("cannot retrieve node with non-existing ID.");
		}
		return node;
	}
	
	/**
	 * Use getNodeByLabel with CAUTION -> 
	 * it has LINEAR runtime in the graph's #nodes
	 */
	getNodeByLabel(label: string) : $N.IBaseNode {
		var id = _.findKey(this._nodes, function(node : $N.IBaseNode) {
			return node.getLabel() === label;
		});
		var node = this._nodes[id];
		if ( !node ) {
			throw new Error("cannot retrieve node with non-existing Label.");
		}
		return node;
	}
	
	nrNodes() : number {
		return Object.keys(this._nodes).length;
	}
	
	getRandomNode() : $N.IBaseNode {
		var keys = Object.keys(this._nodes);
		var idx = (Math.random() * keys.length)|0; // force into integer
		return this._nodes[keys[idx]];
	}
	
	
	
	hasEdgeID(id: number) : boolean {
		return !!this._dir_edges[id] || !!this._und_edges[id];
	}
	
	/**
	 * Use hasEdgeLabel with CAUTION -> 
	 * it has LINEAR runtime in the graph's #edges
	 */
	hasEdgeLabel(label: string) : boolean {
		var dir_id = _.findKey(this._dir_edges, function(edge : $E.IBaseEdge) {
			return edge.getLabel() === label;
		});
		var und_id = _.findKey(this._und_edges, function(edge : $E.IBaseEdge) {
			return edge.getLabel() === label;
		});		
		return !!dir_id || !!und_id;
	}
	
	getEdgeById(id: number) : $E.IBaseEdge {
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
		var dir_id = _.findKey(this._dir_edges, function(edge : $E.IBaseEdge) {
			return edge.getLabel() === label;
		});
		var und_id = _.findKey(this._und_edges, function(edge : $E.IBaseEdge) {
			return edge.getLabel() === label;
		});
		var edge = this._dir_edges[dir_id] || this._und_edges[und_id];
		if ( !edge ) {
			throw new Error("cannot retrieve edge with non-existing Label.");
		}
		return edge;
	}	
	
	addEdge(label: string, node_a : $N.IBaseNode, node_b : $N.IBaseNode, opts? : {}) : $E.IBaseEdge {
		var edge = new $E.BaseEdge(this._und_edge_count++,
															 label,
															 node_a,
															 node_b,
															 opts || {});		
		// connect edge to first node anyways			
		node_a.addEdge(edge);
		
		if ( edge.isDirected() ) {
			// add edge to second node too
			node_b.addEdge(edge);			
			this._dir_edges[edge.getID()] = edge;
			if ( Object.keys(this._und_edges).length ) {
				this._mode = GraphMode.MIXED;
			} else {
				this._mode = GraphMode.DIRECTED;
			}
		} else {
			// add edge to both nodes, except they are the same...
			if ( node_a !== node_b ) {
				node_b.addEdge(edge);
			}
			this._und_edges[edge.getID()] = edge;
			if ( Object.keys(this._dir_edges).length ) {
				this._mode = GraphMode.MIXED;
			} else {
				this._mode = GraphMode.UNDIRECTED;
			}
		}
		return edge;
	}
	
	removeEdge(edge: $E.IBaseEdge) : void {
		var dir_edge = this._dir_edges[edge.getID()];
		var und_edge = this._und_edges[edge.getID()];

		if ( !dir_edge && ! und_edge ) {
			throw new Error('cannot remove non-existing edge.');
		}
		
		var nodes = edge.getNodes();
		nodes.a.removeEdge(edge);
		
		if ( dir_edge ) {
			delete this._dir_edges[edge.getID()];
			nodes.b.removeEdge(edge);			
		} else {
			delete this._und_edges[edge.getID()];			
			if ( nodes.a !== nodes.b ) {
				nodes.b.removeEdge(edge);
			}
		}
	}
	
	nrDirEdges() : number {
		return Object.keys(this._dir_edges).length;
	}
	
	nrUndEdges() : number {
		return Object.keys(this._und_edges).length;
	}
	
	// nrEdges() : number {
	// 	return Object.keys(this._dir_edges).length + Object.keys(this._und_edges).length; 
	// }
	
	getRandomDirEdge() : $E.IBaseEdge {
		var keys = Object.keys(this._dir_edges);
		var idx = (Math.random() * keys.length)|0; // force into integer
		return this._dir_edges[keys[idx]];
	}
	
	getRandomUndEdge() : $E.IBaseEdge {
		var keys = Object.keys(this._und_edges);
		var idx = (Math.random() * keys.length)|0; // force into integer
		return this._und_edges[keys[idx]];
	}
	
	
	getStats() : GraphStats {		
		return {
			nr_nodes: Object.keys(this._nodes).length,
			nr_und_edges: Object.keys(this._und_edges).length,
			nr_dir_edges: Object.keys(this._dir_edges).length
		}
	}
	
	
}


export {GraphMode, GraphStats, IGraph, BaseGraph};
