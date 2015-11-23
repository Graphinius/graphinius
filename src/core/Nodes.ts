import * as Edges from "./Edges";


interface IBaseNode {
	// Properties
	_id					: number;
	_label			: string;
	// Methods
	
}


class BaseNode implements IBaseNode {	
	protected _edge_list	: Array<Edges.IBaseEdge>;
	
	constructor (public _id, public _label) {		
		
	}
	
	
}


export { IBaseNode, BaseNode };