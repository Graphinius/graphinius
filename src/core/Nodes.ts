import * as Edges from "./Edges";


interface IBaseNode {
	_id					: number;
	_label			: string;
	_edge_list	: Array<Edges.IBaseEdge>;
}


class BaseNode {

}


export { IBaseNode, BaseNode };
