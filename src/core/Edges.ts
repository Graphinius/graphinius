import * as Nodes from "./Nodes";

/**
 * Edges are the most basic components in graphinius.
 * They control no other elements below them, but hold
 * references to the nodes they are connecting...
 * @param 
 */
interface IBaseEdge {
	// Public properties
	_id	:	number;
	_label: string;
	
	// DIRECTION Methods
	isDirected()						: boolean;
	setDirected(d:boolean)	: void;
	getDirection()					: boolean; // Exception if not directed
	setDirection(d:boolean)	: void; // Exception if not directed
	
	// WEIGHT Methods
	isWeighted()						: boolean;
	setWeighted(w:boolean)	: void;
	getWeight()							: number; // Exception if not weighted
	setWeight(w:number) 		: void; // Exception if not weighted

	
}

class BaseEdge implements IBaseEdge {
	protected _weighted 	: boolean;
	protected _weight			: number = 0;
	protected _directed		: boolean;
	protected _direction	: boolean = true;
	
	constructor (public _id,
							protected _node_a:Nodes.IBaseNode, 
							protected _node_b:Nodes.IBaseNode, 
							weighted:boolean=false, 
							directed:boolean=false) {								
								this._weighted = weighted;
								this._directed = directed;
	}
	
	isWeighted () : boolean {
		return this._weighted;
	}
	
	
}

export { IBaseEdge, BaseEdge };