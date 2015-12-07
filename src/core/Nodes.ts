import * as Edges from "./Edges";

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
	
	// UNTYPED feature methods
	getUntypedFeatures() : { [k:string] : any };
	// getFeature
	
	// Degrees
	degree(type: EdgeType) : number;
	
	// EDGE methods
	// maybe simplify by internal type => YEP
	addEdge(edge: Edges.IBaseEdge) : void;
	hasEdge(edge: Edges.IBaseEdge) : boolean;	
	hasEdgeID(id: number) : boolean;
	getEdge(id: number) : Edges.IBaseEdge;
	
	// getEdges(type: EdgeType) : Array<Edges.IBaseEdge>;
	
	// removeEdge(id: number) : Edges.IBaseEdge;
	
	// Do we need this? contemplating.....
	// isEdgeType(id: number) : EdgeType;
	clearEdges() : void;
}

interface NodeConstructorOptions {
	
}


class BaseNode implements IBaseNode {
	protected _untyped_features	: { [k:string] : any };
	
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
	
	/**
	 * Next design decision:
	 * Do we only use ONE _edges hash - OR -
	 * separate hashes for _in_edges, _out_edges, _und_edges
	 * As getting edges based on their type during the
	 * execution of graph algorithms is pretty common,
	 * and we have already followed the separation
	 * paradigm with degrees, it's logical to separate.
	 */
	protected _in_edges		: {[k: number] : Edges.IBaseEdge};
	protected _out_edges	: {[k: number] : Edges.IBaseEdge};
	protected _und_edges	: {[k: number] : Edges.IBaseEdge};
	
	constructor (public _id, public _label,
							untyped_features?: { [k:string] : any },
							options?: NodeConstructorOptions) 
	{
		this._in_edges = this._out_edges = this._und_edges = {};
		this._in_degree = this._out_degree = this._dir_degree = this._und_degree = this._all_degree = 0;
		this._untyped_features = untyped_features || {};
		options = options || {};
		// now handle options...
	}
	
	getUntypedFeatures() : { [k:string] : any } {
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
	addEdge(edge: Edges.IBaseEdge) : void {
		// is this edge connected to us at all?
		var nodes = edge.getNodes();
		if ( nodes.a !== this && nodes.b !== this ) {
			throw new Error("Cannot add edge that does not connect to this node");
		}
		
		// Edge with duplicate ID already present?
		if ( this._in_edges[ edge._id ] || this._out_edges[ edge._id ] || this._und_edges[ edge._id ]) {
			throw new Error("Cannot add same edge multiple times.");			
		}
		
		// Is it an undirected or directed edge?
		if ( edge.isDirected() ) {
			// is it outgoing or incoming?
			if ( edge.fromNode() === this ) {
				this._out_edges[edge._id] = edge;
				this._out_degree++;
			}
			else {
				this._in_edges[edge._id] = edge;
				this._in_degree++;
			}			
			this._dir_degree++;
		}
		else {
			this._und_edges[edge._id] = edge;
			this._und_degree++;
		}
		this._all_degree++;
	}
	
	
	hasEdge(edge: Edges.IBaseEdge) : boolean {
		return !!this._in_edges[ edge._id ] || !!this._out_edges[ edge._id ] || !!this._und_edges[ edge._id ];
	}
	
	hasEdgeID(id: number) : boolean {
		return !!this._in_edges[ id ] || !!this._out_edges[ id ] || !!this._und_edges[ id ];
	}
	
	getEdge(id: number) : Edges.IBaseEdge {
		var edge = this._in_edges[id] || this._out_edges[id] || this._und_edges[id];
		if ( !edge ) {
			throw new Error("Cannot retrieve non-existing edge.");
		}
		return edge;
	}
	
	clearEdges() : void {
		this._in_edges = this._out_edges = this._und_edges = {};
		this._in_degree = this._out_degree = this._dir_degree = this._und_degree = this._all_degree = 0;
	}
	
}


export { EdgeType, IBaseNode, BaseNode };
