import * as Nodes from "./Nodes";


interface IBaseEdge {
	_id				:	number;
	_node_a		:	Nodes.IBaseNode;
	_node_b		:	Nodes.IBaseNode;
	_dir			: boolean;
	_weight?	: number;
}


class BaseEdge implements IBaseEdge {
	
	constructor (public _id, public _node_a, public _node_b, public _dir ) {
		
	}
	
}


class WeightedEdge extends BaseEdge {
	constructor (_id, _node_a, _node_b, _dir, _weight ) {
		super(_id, _node_a, _node_b, _dir);
	}
}


export { IBaseEdge, BaseEdge };

