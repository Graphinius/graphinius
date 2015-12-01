import * as Edges from "./Edges";



interface IBaseNode {
	// Public properties
	_id					: number;
	_label			: string;
	
	// Features
	getUntypedFeatures() : Array<{ [k:string] : any }>;
	
	// Degrees
	degree(type: DegreeType) : number;
	
	// EDGE methods
	// maybe simplify by internal type
	// getEdges() 		: Array<Edges.IBaseEdge>;
	// getInEdges() 	: Array<Edges.IBaseEdge>;
	// getOutEdges() 	: Array<Edges.IBaseEdge>;
	// getDirEdges() 	: Array<Edges.IBaseEdge>;
	// getUndEdges() 	: Array<Edges.IBaseEdge>;
	
	// untyped FEATURE methods
	// getFeature
}

interface NodeConstructorOptions {
	
}

enum DegreeType {
	IN,
	OUT,
	DIRECTED,
	UNDIRECTED,
	ALL
}


class BaseNode implements IBaseNode {
	protected _edges	: Array<Edges.IBaseEdge>;
	protected _untyped_features	: Array<{ [k:string] : any }>;
	
	// computing degree on the fly via edge array?
	// or better internally update different degree
	// measures upon edge addition / removal?
	// For now, let's decide on the complicated version
	// that is faster to query though...
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
	
	degree(type: DegreeType) : number {
		switch(type) {
			case DegreeType.IN:
				return this._in_degree;
			case DegreeType.OUT:
				return this._out_degree;
			case DegreeType.DIRECTED:
				return this._dir_degree;
			case DegreeType.UNDIRECTED:
				return this._und_degree;
			case DegreeType.ALL:
				return this._all_degree;
		}
	}
	
}


export { DegreeType, IBaseNode, BaseNode };
