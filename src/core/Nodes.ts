import * as Edges from "./Edges";



interface IBaseNode {
	// Internal properties
	_id					: number;
	_label			: string;
	
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





class BaseNode implements IBaseNode {	
	protected _edges	: Array<Edges.IBaseEdge>;
	protected _untyped_features	: Array<{ [k:string] : any }>;
	
	constructor (public _id, public _label) {		
		
	}
	
	
}


export { IBaseNode, BaseNode };
