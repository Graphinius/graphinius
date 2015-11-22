import * as Nodes from "./Nodes";


interface IBaseEdge {
	id			:	number;
	node_a	:	Nodes.IBaseNode;
	node_b	:	Nodes.IBaseNode;
}

class BaseEdge {
}

export { IBaseEdge, BaseEdge };

