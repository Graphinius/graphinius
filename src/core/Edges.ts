import * as Nodes from "./Nodes";

interface IBaseEdge {
	// Properties
	_id						:	number;
	_node_a				:	Nodes.IBaseNode;
	_node_b				:	Nodes.IBaseNode;
	_directed			: boolean;
	// Methods
	isWeighted()	: boolean;
	// getNodes()		: [Nodes.IBaseNode, Nodes.IBaseNode];
}


class BaseEdge implements IBaseEdge {
	protected _is_weighted : boolean;
	
	constructor (public _id, public _node_a, public _node_b, public _directed ) {
		this._is_weighted = false;	
	}
	
	isWeighted () : boolean {
		return this._is_weighted;
	}	
}





// NOT EVEN NECESSARY RIGHT NOW....
interface IWeightedEdge extends IBaseEdge {
	_weight				: number;
}


class WeightedEdge extends BaseEdge implements IWeightedEdge {
	
	constructor (_id, _node_a, _node_b, _directed, public _weight = 0) {
		super(_id, _node_a, _node_b, _directed);
		this._is_weighted = true;
	}
	
	
	
}


export { IBaseEdge, 
				 IWeightedEdge, 
				 BaseEdge, 
				 WeightedEdge 
			 };