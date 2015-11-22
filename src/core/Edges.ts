import * as Nodes from "./Nodes";


interface IBaseEdge {
	_id			:	number;
	_node_a	:	Nodes.IBaseNode;
	_node_b	:	Nodes.IBaseNode;
}

class BaseEdge {
}

export { IBaseEdge, BaseEdge };

