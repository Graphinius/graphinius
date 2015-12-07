import * as Edges from "./Edges";
var _ = require('underscore');

enum EdgeType {
	IN,
	OUT,
	DIRECTED,
	UNDIRECTED,
	ALL
}

interface IBaseNode {
	// Public properties
	_id					: number;
	_label			: string;
	
	// Features
	getUntypedFeatures() : Array<{ [k:string] : any }>;
	
	// Degrees
	degree(type: EdgeType) : number;
	
	// EDGE methods
	// maybe simplify by internal type => YEP
	addEdge(edge: Edges.IBaseEdge) : void;
	
	// getEdges(type: EdgeType) : Array<Edges.IBaseEdge>;
	// isEdgeType(id: number) : EdgeType;
	// hasEdge(id: number) : boolean;
	// removeEdge(id: number) : Edges.IBaseEdge;
	
	// untyped FEATURE methods
	// getFeature
}

interface NodeConstructorOptions {
	
}


class BaseNode implements IBaseNode {
	protected _edges	: Array<Edges.IBaseEdge>;
	protected _untyped_features	: Array<{ [k:string] : any }>;
	
	/**
	 * computing degree on the fly via edge array?
	 * or better internally update different degree
	 * measures upon edge addition / removal?
	 * The latter suggestion is better in the sense of
	 * DRY / reduced complexity
	 * For now, let's decide on the complicated version
	 * that is faster to query though...
	 */
	protected _in_degree;
	protected _out_degree;
	protected _dir_degree;
	protected _und_degree;
	protected _all_degree;
	
	constructor (public _id, public _label,
							untyped_features?: Array<{ [k:string] : any }>,
							options?: NodeConstructorOptions) 
	{
		this._edges = [];
		this._in_degree = this._out_degree = this._dir_degree = this._und_degree = this._all_degree = 0;
		this._untyped_features = untyped_features || [];
		options = options || [];
		// now handle options...

	}
	
	getUntypedFeatures() : Array<{ [k:string] : any }> {
		return this._untyped_features;
	}
	
	degree(type: EdgeType) : number {
		switch(type) {
			case EdgeType.IN:
				return this._in_degree;
			case EdgeType.OUT:
				return this._out_degree;
			case EdgeType.DIRECTED:
				return this._dir_degree;
			case EdgeType.UNDIRECTED:
				return this._und_degree;
			case EdgeType.ALL:
				return this._all_degree;
		}
	}
	
	/**
	 * We have to: 
	 * 1. throw an error if the edge is already attached
	 * 2. add it to the edge array
	 * 3. check type of edge (directed / undirected)
	 * 4. update our degrees accordingly
	 * This is a design decision we should defend
	 */
	addEdge(edge: Edges.IBaseEdge) : void {
		if ( _.contains( this._edges, edge ) ) {
			throw new Error("Cannot attach same edge multiple times.");
		}
		
		this._edges.push(edge);		
		var dir = edge.isDirected();		
		if ( dir ) {
			
		} else {			
			this._und_degree++;
			this._all_degree++;
		}
	}
	
}


export { EdgeType, IBaseNode, BaseNode };
