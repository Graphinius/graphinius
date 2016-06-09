/// <reference path="../../typings/tsd.d.ts" />

import * as $E from "./Edges";
import * as $DS from "../utils/structUtils";

export interface NeighborEntry {
  node  : IBaseNode;
  edge  : $E.IBaseEdge;
  // only used (and tested) in PFS
  best? : number;
}

export interface IBaseNode {
	getID()	: string;
	getLabel() : string;
	setLabel(label : string) : void;
	
	// FEATURES methods
	getFeatures() : { [k:string] : any };
	getFeature(key: string) : any;
	setFeatures( features: { [k:string]: any } ) : void;	
	setFeature(key: string, value: any) : void;
	deleteFeature(key: string) : any;
	clearFeatures() : void;
	
	// Degrees
	inDegree() : number;
	outDegree() : number;
	degree() : number;
	
	// EDGE methods
	addEdge(edge: $E.IBaseEdge) : void;
	hasEdge(edge: $E.IBaseEdge) : boolean;	
	hasEdgeID(id: string) : boolean;	
	getEdge(id: string) : $E.IBaseEdge;
	
	inEdges() : {[k: string] : $E.IBaseEdge};
	outEdges() : {[k: string] : $E.IBaseEdge};
	undEdges() : {[k: string] : $E.IBaseEdge};
	// TODO hack!! figure out how to appease type system
	dirEdges() : {};
	allEdges() : {};
	
	removeEdge(edge: $E.IBaseEdge) : void;
	removeEdgeID(id: string) : void;
	
	// Clear different types of edges
	clearOutEdges() : void;
	clearInEdges() : void;
	clearUndEdges() : void;
	clearEdges() : void;
	
	// get Nodes connected by incoming / outgoing edges
	prevNodes() : Array<NeighborEntry>;
	nextNodes() : Array<NeighborEntry>;
	// get Nodes connected by undirected edges
	connNodes() : Array<NeighborEntry>;
	// get Nodes connected by outgoing + undirected edges
	reachNodes(identityFunc?: Function) : Array<NeighborEntry>;
}


class BaseNode implements IBaseNode {
	/**
	 * degrees - let's hold them separate in order
	 * to avoid Object.keys(...)
	 */
	private _in_degree = 0;
	private _out_degree = 0;
	private _und_degree = 0;
	
	protected _features	: { [k:string] : any };
		
	/**
	 * Design decision:
	 * Do we only use ONE _edges hash - OR -
	 * separate hashes for _in_edges, _out_edges, _und_edges
	 * As getting edges based on their type during the
	 * execution of graph algorithms is pretty common,
	 * it's logical to separate the structures.
	 */
	protected _in_edges		: {[k: string] : $E.IBaseEdge};
	protected _out_edges	: {[k: string] : $E.IBaseEdge};
	protected _und_edges	: {[k: string] : $E.IBaseEdge};
	protected _label : string;
	
	constructor (protected _id,
							features?: { [k:string] : any }) 
	{
		this._in_edges = {};
		this._out_edges = {};
		this._und_edges = {};
		this._features = typeof features !== 'undefined' ? $DS.clone(features) : {};
		this._label = this._features["label"] || this._id;
	}
	
	getID()	: string {
		return this._id;
	}
	
	getLabel() : string {
		return this._label;
	}
	
	setLabel(label : string) : void {
		this._label = label;
	}
		
	getFeatures() : { [k:string] : any } {
		return this._features;
	}
	
	getFeature(key: string) : any {
		return this._features[key];
		// if ( !feat ) {
		// 	throw new Error("Cannot retrieve non-existing feature.");
		// }
		// return feat;
	}
	
	setFeatures( features: { [k:string]: any } ) : void {
		this._features = $DS.clone(features);
	}
	
	setFeature(key: string, value: any) : void {
		this._features[key] = value;
	}
	
	deleteFeature(key: string) : any {
		var feat = this._features[key];
		// if ( !feat ) {
		// 	throw new Error("Cannot delete non-existing feature.");
		// }
		delete this._features[key];
		return feat;
	}
	
	clearFeatures() : void {
		this._features = {};
	}
				
	inDegree() : number {
		return this._in_degree;
	}
	
	outDegree() : number {
		return this._out_degree;
	}
	
	degree() : number {
		return this._und_degree;
	}
	
	/**
	 * We have to: 
	 * 1. throw an error if the edge is already attached
	 * 2. add it to the edge array
	 * 3. check type of edge (directed / undirected)
	 * 4. update our degrees accordingly
	 * This is a design decision we can defend by pointing out
	 * that querying degrees will occur much more often
	 * than modifying the edge structure of a node (??)
	 * One further point: do we also check for duplicate
	 * edges not in the sense of duplicate ID's but duplicate
	 * structure (nodes, direction) ?
	 * => Not for now, as we would have to check every edge
	 * instead of simply checking the hash id...
	 * ALTHOUGH: adding edges will (presumably) not occur often...
	 */
	addEdge(edge: $E.IBaseEdge) : void {
		// is this edge connected to us at all?
		var nodes = edge.getNodes();
		if ( nodes.a !== this && nodes.b !== this ) {
			throw new Error("Cannot add edge that does not connect to this node");
		}
		var edge_id = edge.getID();
		
		// Is it an undirected or directed edge?
		if ( edge.isDirected() ) {
			// is it outgoing or incoming?
			if ( nodes.a === this && !this._out_edges[edge_id]) {				
				this._out_edges[edge_id] = edge;
				this._out_degree += 1;
				// Is the edge also connecting to ourselves -> loop ?
				if ( nodes.b === this && !this._in_edges[edge_id]) {				
					this._in_edges[edge.getID()] = edge;
					this._in_degree += 1;
				}
			}
			else if ( !this._in_edges[edge_id] ) { // nodes.b === this
				this._in_edges[edge.getID()] = edge;
				this._in_degree += 1;
			}
		}
		else {
			// Is the edge also connecting to ourselves -> loop
			if (this._und_edges[ edge.getID() ]) {
				throw new Error("Cannot add same undirected edge multiple times.");
			}
			this._und_edges[edge.getID()] = edge;
			this._und_degree += 1;
		}
	}
	
	hasEdge(edge: $E.IBaseEdge) : boolean {
		return !!this._in_edges[ edge.getID() ] || !!this._out_edges[ edge.getID() ] || !!this._und_edges[ edge.getID() ];
	}
	
	hasEdgeID(id: string) : boolean {
		return !!this._in_edges[ id ] || !!this._out_edges[ id ] || !!this._und_edges[ id ];
	}
	
	getEdge(id: string) : $E.IBaseEdge {
		var edge = this._in_edges[id] || this._out_edges[id] || this._und_edges[id];
		if ( !edge ) {
			throw new Error("Cannot retrieve non-existing edge.");
		}
		return edge;
	}
	
	inEdges() : {[k: string] : $E.IBaseEdge} {
		return this._in_edges;
	}
	
	outEdges() : {[k: string] : $E.IBaseEdge} {
		return this._out_edges;
	}
	
	undEdges() : {[k: string] : $E.IBaseEdge} {
		return this._und_edges;
	}

	dirEdges() : {} {
		return $DS.mergeObjects([this._in_edges, this._out_edges]);
	}

	allEdges() : {} {
		return $DS.mergeObjects([this._in_edges, this._out_edges, this._und_edges]);
	}
	
	removeEdge(edge: $E.IBaseEdge) : void {
		if ( !this.hasEdge(edge) ) {
			throw new Error("Cannot remove unconnected edge.");
		}
		var id = edge.getID();		
		var e = this._und_edges[id];
		if ( e ) {
			delete this._und_edges[id];
			this._und_degree -= 1;
		}
		e = this._in_edges[id];
		if ( e ) {
			delete this._in_edges[id];
			this._in_degree -= 1;
		}
		e = this._out_edges[id];
		if ( e ) {
			delete this._out_edges[id];
			this._out_degree -= 1;
		}
	}
	
	removeEdgeID(id: string) : void {
		if ( !this.hasEdgeID(id) ) {
			throw new Error("Cannot remove unconnected edge.");
		}
		var e = this._und_edges[id];
		if ( e ) { 
			delete this._und_edges[id];
			this._und_degree -= 1;
		}
		e = this._in_edges[id];
		if ( e ) { 
			delete this._in_edges[id];
			this._in_degree -= 1;
		}
		e = this._out_edges[id];
		if ( e ) { 
			delete this._out_edges[id];
			this._out_degree -= 1;
		}
	}
	
	clearOutEdges() : void {
		this._out_edges = {};
		this._out_degree = 0;
	}
	
	clearInEdges() : void {
		this._in_edges = {};		
		this._in_degree = 0;
	}
	
	clearUndEdges() : void {
		this._und_edges = {};
		this._und_degree = 0;
	}
	
	clearEdges() : void {
		this.clearInEdges();
		this.clearOutEdges();
		this.clearUndEdges();
	}
	
	prevNodes() : Array<NeighborEntry> {
		var prevs : Array<NeighborEntry> = [];
		var key 	: string,
				edge 	: $E.IBaseEdge;
				
		for ( key in this._in_edges ) {
			if ( this._in_edges.hasOwnProperty(key) ) {
        edge = this._in_edges[key];
				prevs.push({
          node: edge.getNodes().a,
          edge: edge
        });
			}
		}		
		return prevs;
	}
	
	nextNodes() : Array<NeighborEntry> {
		var nexts : Array<NeighborEntry> = [];
		var key 	: string,
				edge 	: $E.IBaseEdge;
		
		for ( key in this._out_edges ) {
			if ( this._out_edges.hasOwnProperty(key) ) {
        edge = this._out_edges[key];
				nexts.push({
          node: edge.getNodes().b,
          edge: edge
        });
			}
		}
		return nexts;
	}
	
	connNodes() : Array<NeighborEntry> {
		var conns : Array<NeighborEntry> = [];
		var key 	: string,
				edge 	: $E.IBaseEdge;
		
		for ( key in this._und_edges ) {
			if ( this._und_edges.hasOwnProperty(key) ) {
        edge = this._und_edges[key];
				var nodes = edge.getNodes();
				if ( nodes.a === this ) {
					conns.push({
            node: edge.getNodes().b,
            edge: edge
          });
				}
				else {
					conns.push({
            node: edge.getNodes().a,
            edge: edge
          });
				}
			}
		}
		return conns;
	}


	/**
	 *
	 * @param identityFunc can be used to remove 'duplicates' from resulting array,
	 * if necessary
	 * @returns {Array}
	 *
   */
	reachNodes(identityFunc?: Function) : Array<NeighborEntry> {
		var identity = 0;
		// console.log(this.nextNodes());
    return $DS.mergeArrays([this.nextNodes(), this.connNodes()],
			identityFunc || function(ne) {return identity++});
	}
	
}


export { BaseNode };
