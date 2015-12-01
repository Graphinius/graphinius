import * as Nodes from './Nodes';

enum GraphMode {
	INIT, 
	DIRECTED, 
	UNDIRECTED, 
	MIXED
};


interface IGraph {
	addNode() : Nodes.IBaseNode;
}


class Graph implements IGraph {
	private _mode : GraphMode;
	
	constructor () {
		this._mode = GraphMode.INIT;
	}
	
	addNode() {
		var node = new Nodes.BaseNode(1, "new");
		
		return node;
	}
	
}


export {GraphMode, IGraph, Graph};
