import {TypedNode} from '../typed/TypedNode';
import * as $SU from '@/utils/StructUtils';
import {IBaseEdge} from "./BaseEdge";


export interface NeighborEntry {
  node  : IBaseNode;
  edge  : IBaseEdge;
  // only used (and tested) in PFS
  best? : number;
}

export interface BaseNodeConfig {
	label?			: string;
	features?		: {[key: string]: any};
}

type NodeFeatures = { [k:string]: any };


export interface IBaseNode {
	// BASIC
	readonly id: string;
	readonly label: string;
	readonly features: NodeFeatures;
	setLabel(label : string) : void;

	/**
	 * @todo old method versions -> take out..
	 */
	getID()	: string;
	getLabel() : string;
	
	// FEATURES methods
	getFeatures() : NodeFeatures;
	getFeature(key: string) : any;
	f(key:string) : any | undefined; // shortcut for getFeature
	setFeatures( features: NodeFeatures ) : void;
	setFeature(key: string, value: any) : void;
	deleteFeature(key: string) : any;
	clearFeatures() : void;
	
	// Degrees
	readonly deg: number;
	readonly in_deg: number;
	readonly out_deg: number;
	readonly self_deg: number;
	readonly self_in_deg: number;
	readonly self_out_deg: number;
	
	// EDGE methods
	addEdge(edge: IBaseEdge) : IBaseEdge;
	hasEdge(edge: IBaseEdge) : boolean;	
	hasEdgeID(id: string) : boolean;	
	getEdge(id: string) : IBaseEdge;

	inEdges() : {[k: string] : IBaseEdge};
	outEdges() : {[k: string] : IBaseEdge};
	undEdges() : {[k: string] : IBaseEdge};
	dirEdges() : {[k: string] : IBaseEdge};
	allEdges() : {[k: string] : IBaseEdge};

	removeEdge(edge: IBaseEdge) : void;
	removeEdgeByID(id: string) : void;
	
	// Clear different types of edges
	clearOutEdges() : void;
	clearInEdges() : void;
	clearUndEdges() : void;
	clearEdges() : void;
	
	// neighborhood methods
	prevNodes() : Array<NeighborEntry>;
	nextNodes() : Array<NeighborEntry>;
	connNodes() : Array<NeighborEntry>;
	reachNodes(identityFunc?: Function) : Array<NeighborEntry>;
	allNeighbors(identityFunc?: Function) : Array<NeighborEntry>;

	clone() : IBaseNode;
}


class BaseNode implements IBaseNode {
	protected _label : string;
	protected _in_deg = 0;
	protected _out_deg = 0;
	protected _deg = 0;
	protected _self_in_deg = 0;
	protected _self_out_deg = 0;
	protected _self_deg = 0;

	protected _features	: NodeFeatures;

	protected _in_edges		: {[k: string] : IBaseEdge};
	protected _out_edges	: {[k: string] : IBaseEdge};
	protected _und_edges	: {[k: string] : IBaseEdge};

	/**
	 * @param _id
	 * @param config
	 */
	constructor (
								protected _id: string,
								config: BaseNodeConfig = {}
							)
	{
		this._in_edges = {};
		this._out_edges = {};
		this._und_edges = {};
		this._label = config.label || _id;
		this._features = config.features != null ? $SU.clone(config.features) : {};
	}

	static isTyped(arg: any): arg is TypedNode {
		return !!arg.type;
	}

	get id(): string {
		return this._id;
	}

	get label(): string {
		return this._label;
	}

	get features(): NodeFeatures {
		return this._features;
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
	
	getFeature(key: string) : any | undefined {
		return this._features[key];
	}

	f(key:string) : any | undefined {
		return this.getFeature(key);
	}
	
	setFeatures( features: { [k:string]: any } ) : void {
		this._features = $SU.clone(features);
	}
	
	setFeature(key: string, value: any) : void {
		this._features[key] = value;
	}
	
	deleteFeature(key: string) : any {
		let feat = this._features[key];
		delete this._features[key];
		return feat;
	}
	
	clearFeatures() : void {
		this._features = {};
	}

	get deg() : number {
		return this._deg;
	}

	get in_deg() : number {
		return this._in_deg;
	}

	get out_deg() : number {
		return this._out_deg;
	}

	get self_deg() : number {
		return this._self_deg;
	}

	get self_in_deg() : number {
		return this._self_in_deg;
	}

	get self_out_deg() : number {
		return this._self_out_deg;
	}

	/**
	 * We have to: 
	 * 1. throw an error if the edge is already attached
	 * 2. add it to the edge array
	 * 3. check type of edge (directed / undirected)
	 * 4. update our degrees accordingly
	 */
	addEdge(edge: IBaseEdge) : IBaseEdge {
		let ends = edge.getNodes();
		if ( ends.a !== this && ends.b !== this ) {
			throw new Error("Cannot add edge that does not connect to this node");
		}
		const id = edge.id;

		if ( edge.isDirected() ) {
			// is it outgoing or incoming?
			if ( ends.a === this && !this._out_edges[id]) {
				this._out_edges[id] = edge;
				this._out_deg += 1;
				// Directed self loop ?
				if ( ends.b === this && !this._in_edges[id]) {
					this._in_edges[id] = edge;
					this._in_deg += 1;
					this._self_in_deg += 1;
					this._self_out_deg += 1;
				}
			}
			// No self loop
			else if ( !this._in_edges[id] ) { // nodes.b === this
				this._in_edges[id] = edge;
				this._in_deg += 1;
			}
		}
		// UNdirected
		else {
			if (this._und_edges[ edge.id ]) {
				throw new Error("Cannot add same undirected edge multiple times.");
			}
			this._und_edges[id] = edge;
			this._deg += 1;
			if ( ends.a === ends.b ) {
				this._self_deg += 1;
			}
		}
		return edge;
	}
	hasEdge(edge: IBaseEdge) : boolean {
		return !!this._in_edges[ edge.getID() ] || !!this._out_edges[ edge.getID() ] || !!this._und_edges[ edge.getID() ];
	}
	
	hasEdgeID(id: string) : boolean {
		return !!this._in_edges[ id ] || !!this._out_edges[ id ] || !!this._und_edges[ id ];
	}
	
	getEdge(id: string) : IBaseEdge {
		let edge = this._in_edges[id] || this._out_edges[id] || this._und_edges[id];
		if ( !edge ) {
			throw new Error("Cannot retrieve non-existing edge.");
		}
		return edge;
	}
	
	inEdges() : {[k: string] : IBaseEdge} {
		return this._in_edges;
	}
	
	outEdges() : {[k: string] : IBaseEdge} {
		return this._out_edges;
	}
	
	undEdges() : {[k: string] : IBaseEdge} {
		return this._und_edges;
	}

	dirEdges() : {[k: string] : IBaseEdge} {
		return $SU.mergeObjects([this._in_edges, this._out_edges]);
	}

	allEdges() : {[k: string] : IBaseEdge} {
		return $SU.mergeObjects([this._in_edges, this._out_edges, this._und_edges]);
	}

	/**
	 * @description automatically takes care of self-loops (since looking up in all internal data structures)
	 * @param edge
	 */
	removeEdge(edge: IBaseEdge) : void {
		if ( !this.hasEdge(edge) ) {
			throw new Error("Cannot remove unconnected edge.");
		}
		const id = edge.id;
		const ends = edge.getNodes();
		let e = this._und_edges[id];
		if ( e ) {
			delete this._und_edges[id];
			this._deg -= 1;
			( ends.a === ends.b ) && ( this._self_deg -= 1 );
		}
		e = this._in_edges[id];
		if ( e ) {
			delete this._in_edges[id];
			this._in_deg -= 1;
			( ends.a === ends.b ) && ( this._self_in_deg -= 1 );
		}
		e = this._out_edges[id];
		if ( e ) {
			delete this._out_edges[id];
			this._out_deg -= 1;
			( ends.a === ends.b ) && ( this._self_out_deg -= 1 );
		}
	}

	removeEdgeByID(id: string) : void {
		if ( !this.hasEdgeID(id) ) {
			throw new Error("Cannot remove unconnected edge.");
		}
		this.removeEdge(this.getEdge(id));
	}

	/**
	 * @description slow -> if possible, just clear ALL edges instead
	 */
	clearOutEdges() : void {
		for ( let e of Object.values(this.outEdges()) ) {
			this.removeEdge(e);
		}
	}

	/**
	 * @description slow -> if possible, just clear ALL edges instead
	 */
	clearInEdges() : void {
		for ( let e of Object.values(this.inEdges()) ) {
			this.removeEdge(e);
		}
	}

	clearUndEdges() : void {
		this._und_edges = {};
		this._deg = 0;
		this._self_deg = 0;
	}
	
	clearEdges() : void {
		this.clearUndEdges();
		this._in_edges = {};
		this._out_edges = {};
		this._deg = this._self_deg = this._in_deg = this._self_in_deg = this._out_deg = this._self_out_deg = 0;
	}
	
	/**
	 * return the set of all nodes that have
	 * directed edges coming into this node
	 */
	prevNodes() : Array<NeighborEntry> {
		let prevs : Array<NeighborEntry> = [];
		let key 	: string,
				edge 	: IBaseEdge;
				
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
	
	/**
	 * return the set of all nodes that have
	 * directed edges going out from this node
	 */
	nextNodes() : Array<NeighborEntry> {
		let nexts : Array<NeighborEntry> = [];
		let key 	: string,
				edge 	: IBaseEdge;
		
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
	
	/**
	 * return the set of all nodes that are
	 * connected to this node via undirected edges
	 */
	connNodes() : Array<NeighborEntry> {
		let conns : Array<NeighborEntry> = [];
		let key 	: string,
				edge 	: IBaseEdge;
		
		for ( key in this._und_edges ) {
			if ( this._und_edges.hasOwnProperty(key) ) {
        edge = this._und_edges[key];
				let nodes = edge.getNodes();
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
	 * return the set of all nodes 'reachable' from this node,
	 * either via unconnected or outgoing edges
	 *
	 * @param identityFunc can be used to remove 'duplicates' from resulting array,
	 * if necessary
	 * @returns {Array}
	 *
   */
	reachNodes(identityFunc?: Function) : Array<NeighborEntry> {
		let identity = 0;
    return $SU.mergeArrays(
			[ this.nextNodes(), this.connNodes() ],
			identityFunc || ( ne => identity++ )
		);
	}


	/**
	 * return the set of all nodes connected to this node
	 *
	 * @param identityFunc can be used to remove 'duplicates' from resulting array,
	 * if necessary
	 * @returns {Array}
	 *
   */
	allNeighbors(identityFunc?: Function) : Array<NeighborEntry> {
		let identity = 0;
		// console.log(this.nextNodes());
    return $SU.mergeArrays([this.prevNodes(), this.nextNodes(), this.connNodes()],
			identityFunc || function(ne) {return identity++});
	}


	clone() : IBaseNode {
		let new_node = new BaseNode(this._id);
		new_node._label = this._label;
		new_node.setFeatures( $SU.clone( this.getFeatures() ) );
		return new_node;
	}
	
}

export { BaseNode };
