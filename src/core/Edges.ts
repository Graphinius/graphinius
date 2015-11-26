import * as Nodes from "./Nodes";

/**
 * Edges are the most basic components in graphinius.
 * They control no other elements below them, but hold
 * references to the nodes they are connecting...
 * @param 
 */
interface IBaseEdge {
	// Public properties
	_id			:	string;
	_label	: string;
	
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

interface EdgeConstructorOptions {
	directed?		: boolean;
	direction? 	: boolean;
	weighted?		: boolean;
	weight?			: number;	
}

class BaseEdge implements IBaseEdge {
	protected _directed		: boolean;
	protected _direction	: boolean;
	protected _weighted 	: boolean;
	protected _weight			: number;
	
	constructor (public _id, public _label,
							protected _node_a:Nodes.IBaseNode, 
							protected _node_b:Nodes.IBaseNode, 
							options?: EdgeConstructorOptions) 
	{
		options = options || {};
		this._directed = options.directed || false;
		this._direction = options.direction || true;					
		this._weighted = options.weighted || false;
		this._weight = options.weight || 0;
	}
	
	isDirected () : boolean {
		return this._directed;
	}
	
	setDirected (d:boolean)	: void {
		
	}
	
	getDirection() : boolean {
		return this._direction;
	}
	
	setDirection(d:boolean)	: void {
		
	}
	
	isWeighted () : boolean {
		return this._weighted;
	}
	
	setWeighted(w:boolean) : void {
		
	}
	
	getWeight() : number {
		return this._weight;
	}
	
	setWeight(w:number) : void {
		
	}
	
}

export { IBaseEdge, BaseEdge };