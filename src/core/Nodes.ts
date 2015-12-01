import * as Edges from "./Edges";



interface IBaseNode {
	// Public properties
	_id					: number;
	_label			: string;
	
	// Features
	getUntypedFeatures() : Array<{ [k:string] : any }>;
	
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


class BaseNode implements IBaseNode {	
	protected _edges	: Array<Edges.IBaseEdge>;
	protected _untyped_features	: Array<{ [k:string] : any }>;
	
	constructor (public _id, public _label,
							untyped_features?: Array<{ [k:string] : any }>,
							options?: NodeConstructorOptions) 
	{		
		this._edges = [];
		this._untyped_features = untyped_features || [];
		options = options || [];
		// now handle options...
	}
	
	getUntypedFeatures() : Array<{ [k:string] : any }> {
		return this._untyped_features;
	}
	
}


export { IBaseNode, BaseNode };
