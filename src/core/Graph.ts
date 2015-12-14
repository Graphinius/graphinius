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
	addEdge(label: string, node_a : $N.IBaseNode, node_b : $N.IBaseNode, opts? : {}) : $E.IBaseEdge;
	// hasEdge()
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
		this._nodes[node._id] = node;		
		return node;
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
			this._dir_edges[edge._id] = edge;
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
			this._und_edges[edge._id] = edge;
			if ( Object.keys(this._dir_edges).length ) {
				this._mode = GraphMode.MIXED;
			} else {
				this._mode = GraphMode.UNDIRECTED;
			}
		}
		return edge;
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
